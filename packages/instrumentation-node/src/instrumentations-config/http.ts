import { Span } from '@opentelemetry/api';
import { HttpInstrumentationConfig } from '@opentelemetry/instrumentation-http';
import { IncomingMessage, ServerResponse, ClientRequest } from 'http';
import { HttpExtendedAttribute } from '../enums';
import { shouldCaptureBodyByMimeType } from '../payload-collection/mime-type';
import { StreamChunks } from '../payload-collection/stream-chunks';
import { AutoInstrumentationOptions } from '../types';
import { callHookOnlyOnRecordingSpan } from '../payload-collection/recording-span';

const streamChunksKey = Symbol('opentelemetry.instrumentation.http.StreamChunks');

const httpCustomAttributes = (
    span: Span,
    request: ClientRequest | IncomingMessage,
    response: IncomingMessage | ServerResponse
): void => {
    if (request instanceof ClientRequest) {
        const reqPath = request.path.split('?')[0];
        span.setAttribute(HttpExtendedAttribute.HTTP_PATH, reqPath);
        span.setAttribute(
            HttpExtendedAttribute.HTTP_REQUEST_HEADERS,
            JSON.stringify((request as ClientRequest).getHeaders())
        );
    }
    if (response instanceof IncomingMessage) {
        span.setAttribute(
            HttpExtendedAttribute.HTTP_RESPONSE_HEADERS,
            JSON.stringify((response as IncomingMessage).headers)
        );
    }

    const requestBody: StreamChunks = request[streamChunksKey];
    if (requestBody) {
        span.setAttribute(HttpExtendedAttribute.HTTP_REQUEST_BODY, requestBody.getBody());
    }

    const responseBody: StreamChunks = response[streamChunksKey];
    if (responseBody) {
        span.setAttribute(HttpExtendedAttribute.HTTP_RESPONSE_BODY, responseBody.getBody());
    }
};

const httpCustomAttributesOnRequest = (span: Span, request: ClientRequest | IncomingMessage): void => {
    if (request instanceof ClientRequest) {
        const requestMimeType = request.getHeader('content-type') as string;
        if (!shouldCaptureBodyByMimeType(requestMimeType)) {
            span.setAttribute(
                HttpExtendedAttribute.HTTP_REQUEST_BODY,
                `Request body not collected due to unsupported mime type: ${requestMimeType}`
            );
            return;
        }

        let oldWrite = request.write;
        request[streamChunksKey] = new StreamChunks();
        request.write = function (data: any) {
            const aspectoData: StreamChunks = request[streamChunksKey];
            aspectoData?.addChunk(data);
            return oldWrite.call(request, data);
        };
    }
};

const httpCustomAttributesOnResponse = (span: Span, response: IncomingMessage | ServerResponse): void => {
    if (response instanceof IncomingMessage) {
        const responseMimeType = response.headers?.['content-type'] as string;
        if (!shouldCaptureBodyByMimeType(responseMimeType)) {
            span.setAttribute(
                HttpExtendedAttribute.HTTP_RESPONSE_BODY,
                `Response body not collected due to unsupported mime type: ${responseMimeType}`
            );
            return;
        }

        response[streamChunksKey] = new StreamChunks();
        const origPush = response.push;
        response.push = function (chunk: any) {
            if (chunk) {
                const aspectoData: StreamChunks = response[streamChunksKey];
                aspectoData?.addChunk(chunk);
            }
            return origPush.apply(this, arguments);
        };
    }
};

export const httpInstrumentationConfig = (options: AutoInstrumentationOptions): HttpInstrumentationConfig => ({
    applyCustomAttributesOnSpan: callHookOnlyOnRecordingSpan(httpCustomAttributes),
    requestHook: options.collectPayloads && callHookOnlyOnRecordingSpan(httpCustomAttributesOnRequest),
    responseHook: options.collectPayloads && callHookOnlyOnRecordingSpan(httpCustomAttributesOnResponse),
});
