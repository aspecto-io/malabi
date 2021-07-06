import { SpanAttributeValue, Span } from '@opentelemetry/api';
import { callHookOnlyOnRecordingSpan } from '../payload-collection/recording-span';
import { IORedisInstrumentationConfig } from '@opentelemetry/instrumentation-ioredis';
import { DbExtendedAttribute, GeneralExtendedAttribute } from '../enums';
import { getModuleVersion } from './module-version';
import { AutoInstrumentationOptions } from '../types';

const ioredisCustomAttributesOnResponse =
    (options: AutoInstrumentationOptions) =>
    (span: Span, _cmdName: string, _cmdArgs: Array<string | Buffer | number>, response: any): void => {
        if (options.collectPayloads) {
            let responsePayload: SpanAttributeValue;
            if (typeof response === 'string' || typeof response === 'number') {
                responsePayload = response;
            } else if (response instanceof Buffer) {
                responsePayload = response.toString();
            } else if (typeof response === 'object') {
                responsePayload = JSON.stringify(response);
            }

            if (responsePayload !== undefined) {
                span.setAttribute(DbExtendedAttribute.DB_RESPONSE, responsePayload);
            }
        }

        const version = getModuleVersion('ioredis');
        if (version) {
            span.setAttribute(GeneralExtendedAttribute.INSTRUMENTED_LIBRARY_VERSION, version);
        }
    };

export const ioredisInstrumentationConfig = (options: AutoInstrumentationOptions): IORedisInstrumentationConfig => ({
    responseHook: callHookOnlyOnRecordingSpan(ioredisCustomAttributesOnResponse(options)),
});
