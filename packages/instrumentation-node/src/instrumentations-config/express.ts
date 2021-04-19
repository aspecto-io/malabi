import type { Request, Response } from 'express';
import { ExpressInstrumentationConfig } from '@aspecto/opentelemetry-instrumentation-express';
import { callHookOnlyOnRecordingSpan } from '../payload-collection/recording-span';
import { Span } from '@opentelemetry/api';
import { GeneralExtendedAttribute, HttpExtendedAttribute } from '../enums';
import { shouldCaptureBodyByMimeType } from '../payload-collection/mime-type';
import { StreamChunks } from '../payload-collection/stream-chunks';
import { AutoInstrumentationOptions } from '../types';

export const requestHook = (options: AutoInstrumentationOptions) => (span: Span, req: Request, res: Response) => {
    span.setAttributes({
        [HttpExtendedAttribute.HTTP_PATH]: req.path,
        [HttpExtendedAttribute.HTTP_REQUEST_HEADERS]: JSON.stringify(req.headers),
    });

    const requestMimeType = req.get('content-type');
    const captureRequestBody = options.collectPayloads && shouldCaptureBodyByMimeType(requestMimeType);
    const requestStreamChunks = new StreamChunks();

    if (captureRequestBody) {
        req.on('data', (chunk) => requestStreamChunks.addChunk(chunk));
    }

    const responseStreamChunks = new StreamChunks();

    if (options.collectPayloads) {
        const originalResWrite = res.write;

        (res as any).write = function (chunk: any) {
            responseStreamChunks.addChunk(chunk);
            originalResWrite.apply(res, arguments);
        };
    }

    const oldResEnd = res.end;
    res.end = function (chunk: any) {
        oldResEnd.apply(res, arguments);

        const responseMimeType = res.get('content-type');
        const captureResponseBody = options.collectPayloads && shouldCaptureBodyByMimeType(responseMimeType);
        if (captureResponseBody) responseStreamChunks.addChunk(chunk);

        if (options.collectPayloads) {
            span.setAttributes({
                [HttpExtendedAttribute.HTTP_REQUEST_BODY]: captureRequestBody
                    ? requestStreamChunks.getBody()
                    : `Request body not collected due to unsupported mime type: ${requestMimeType}`,
                [HttpExtendedAttribute.HTTP_RESPONSE_BODY]: captureResponseBody
                    ? responseStreamChunks.getBody()
                    : `Response body not collected due to unsupported mime type: ${responseMimeType}`,
            });
        }

        span.setAttributes({
            [HttpExtendedAttribute.HTTP_RESPONSE_HEADERS]: JSON.stringify(res.getHeaders()),
        });
    };
};

export const expressInstrumentationConfig = (options: AutoInstrumentationOptions): ExpressInstrumentationConfig => ({
    moduleVersionAttributeName: GeneralExtendedAttribute.INSTRUMENTED_LIBRARY_VERSION,
    requestHook: callHookOnlyOnRecordingSpan(requestHook(options)),
});
