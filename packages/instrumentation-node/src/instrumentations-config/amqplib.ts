import { Span } from '@opentelemetry/api';
import { AmqplibInstrumentationConfig, PublishParams, EndOperation } from 'opentelemetry-instrumentation-amqplib';
import { callHookOnlyOnRecordingSpan } from '../payload-collection/recording-span';
import type amqp from 'amqplib';
import { GeneralExtendedAttribute, MessagingExtendedAttribute } from '../enums';
import { AutoInstrumentationOptions } from '../types';

const amqplibPublishHook = (span: Span, publishParams: PublishParams) => {
    if (publishParams.content !== undefined) {
        span.setAttribute(MessagingExtendedAttribute.MESSAGING_PAYLOAD, publishParams.content.toString());
    }
};

const amqplibConsumeHook = (span: Span, msg: amqp.ConsumeMessage | null) => {
    if (msg?.content !== undefined) {
        span.setAttribute(MessagingExtendedAttribute.MESSAGING_PAYLOAD, msg.content.toString());
    }
};

const amqplibConsumeEndHook = (
    span: Span,
    _msg: amqp.ConsumeMessage | null,
    _rejected: boolean,
    endOperation: EndOperation
) => {
    span.setAttribute(MessagingExtendedAttribute.MESSAGING_RABBITMQ_CONSUME_END_OPERATION, endOperation);
};

export const amqplibInstrumentationConfig = (options: AutoInstrumentationOptions): AmqplibInstrumentationConfig => ({
    moduleVersionAttributeName: GeneralExtendedAttribute.INSTRUMENTED_LIBRARY_VERSION,
    publishHook: options.collectPayloads && callHookOnlyOnRecordingSpan(amqplibPublishHook),
    consumeHook: options.collectPayloads && callHookOnlyOnRecordingSpan(amqplibConsumeHook),
    consumeEndHook: options.collectPayloads && callHookOnlyOnRecordingSpan(amqplibConsumeEndHook),
});
