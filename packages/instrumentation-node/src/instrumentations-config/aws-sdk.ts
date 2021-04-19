import { Span } from '@opentelemetry/api';
import { callHookOnlyOnRecordingSpan } from '../payload-collection/recording-span';
import {
    AwsSdkInstrumentationConfig,
    NormalizedRequest,
    NormalizedResponse,
} from 'opentelemetry-instrumentation-aws-sdk';
import { DbExtendedAttribute, GeneralExtendedAttribute, MessagingExtendedAttribute } from '../enums';
import { AutoInstrumentationOptions } from '../types';

const enum AttributeNames {
    AWS_REQUEST_PARAMS = 'aws.request.params',
}

const whiteListParams: Record<string, string[]> = {
    sqs: ['QueueUrl', 'DelaySeconds', 'MaxNumberOfMessages', 'WaitTimeSeconds'],
    s3: ['Bucket', 'Key', 'ACL', 'ContentType', 'ResponseContentType'],
    sns: ['TopicArn'],
    kinesis: ['StreamName', 'PartitionKey'],
    firehose: ['DeliveryStreamName'],
    ebs: ['SnapshotId'],
    ssm: ['Name'],
    lambda: ['FunctionName'],
    athena: ['WorkGroup', 'QueryString'],
    sts: ['RoleArn'],
};

const getRequestWhitelistedParams = (serviceName: string, requestParams: Record<string, any>): Record<string, any> => {
    const paramsToCapture: string[] = whiteListParams[serviceName];
    if (!paramsToCapture || !requestParams) return;

    return paramsToCapture.reduce((whiteListParams: Record<string, any>, currParamName: string) => {
        const val = requestParams[currParamName];
        if (val !== undefined) {
            whiteListParams[currParamName] = val;
        }
        return whiteListParams;
    }, {});
};

const addSqsPayload = (span: Span, request: NormalizedRequest) => {
    let payload;
    switch (request.commandName) {
        case 'sendMessage': {
            payload = request.commandInput?.MessageBody;
            if (typeof payload !== 'string') return;
            break;
        }

        case 'sendMessageBatch': {
            let messagesPayload = request.commandInput?.Entries?.map((entry) => ({
                msgId: entry.Id,
                payload: entry.MessageBody,
            }));
            try {
                payload = JSON.stringify(messagesPayload);
            } catch {}
            break;
        }
    }

    if (payload === undefined) return;
    span.setAttribute(MessagingExtendedAttribute.MESSAGING_PAYLOAD, payload);
};

const awsSdkRequestHook = (options: AutoInstrumentationOptions) => (span: Span, request: NormalizedRequest) => {
    const paramsToAttach = getRequestWhitelistedParams(request.serviceName, request.commandInput);
    if (paramsToAttach) {
        try {
            span.setAttribute(AttributeNames.AWS_REQUEST_PARAMS, JSON.stringify(paramsToAttach));
        } catch {}
    }

    switch (request.serviceName) {
        case 'sqs':
            if(options.collectPayloads) {
                addSqsPayload(span, request);
            }
            break;
    }
};

const awsSdkResponseHook = (span: Span, response: NormalizedResponse) => {
    if (response.request.serviceName === 'dynamodb') {
        if (typeof response.data !== 'object') return;
        span.setAttribute(DbExtendedAttribute.DB_RESPONSE, JSON.stringify(response.data));
    }
};

interface SqsMessage {
    Body?: string;
}

const sqsProcessCapturePayload = (span: Span, message: SqsMessage) => {
    if (message.Body === undefined) return;
    span.setAttribute(MessagingExtendedAttribute.MESSAGING_PAYLOAD, message.Body);
};

export const awsSdkInstrumentationConfig = (options: AutoInstrumentationOptions): AwsSdkInstrumentationConfig => ({
    preRequestHook: callHookOnlyOnRecordingSpan(awsSdkRequestHook(options)),
    responseHook: options.collectPayloads && callHookOnlyOnRecordingSpan(awsSdkResponseHook),
    sqsProcessHook: options.collectPayloads && callHookOnlyOnRecordingSpan(sqsProcessCapturePayload),
    suppressInternalInstrumentation: options.suppressInternalInstrumentation,
    moduleVersionAttributeName: GeneralExtendedAttribute.INSTRUMENTED_LIBRARY_VERSION,
});
