import { Span } from '@opentelemetry/api';
import { SequelizeInstrumentationConfig } from 'opentelemetry-instrumentation-sequelize';
import { TypeormInstrumentationConfig } from 'opentelemetry-instrumentation-typeorm';
import { DbExtendedAttribute, GeneralExtendedAttribute } from '../enums';
import { AutoInstrumentationOptions } from '../types';
import { callHookOnlyOnRecordingSpan } from '../payload-collection/recording-span';

const addResponsePayload = (span: Span, response: any) => {
    const stringified = JSON.stringify(response);
    if (!stringified) return;

    const binarySize = Buffer.byteLength(stringified, 'utf8');
    // Limit to 0.5MB.
    if (binarySize > 500000) return;

    span.setAttribute(DbExtendedAttribute.DB_RESPONSE, stringified);
};

export const typeormInstrumentationConfig = (options: AutoInstrumentationOptions): TypeormInstrumentationConfig => ({
    responseHook: options.collectPayloads && callHookOnlyOnRecordingSpan(addResponsePayload),
    moduleVersionAttributeName: GeneralExtendedAttribute.INSTRUMENTED_LIBRARY_VERSION,
});

export const sequelizeInstrumentationConfig = (
    options: AutoInstrumentationOptions
): SequelizeInstrumentationConfig => ({
    responseHook: options.collectPayloads && callHookOnlyOnRecordingSpan(addResponsePayload),
    moduleVersionAttributeName: GeneralExtendedAttribute.INSTRUMENTED_LIBRARY_VERSION,
    ignoreOrphanedSpans: true,
});
