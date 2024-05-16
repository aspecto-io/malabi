import { Span } from '@opentelemetry/api';
import {
    MongooseInstrumentationConfig,
    SerializerPayload,
    MongooseResponseCustomAttributesFunction,
    DbStatementSerializer,
} from '@opentelemetry/instrumentation-mongoose';
import { callHookOnlyOnRecordingSpan } from '../payload-collection/recording-span';
import { DbExtendedAttribute, GeneralExtendedAttribute } from '../enums';
import { AutoInstrumentationOptions } from '../types';

const isEmpty = (obj: any) => !obj || (typeof obj === 'object' && Object.keys(obj).length === 0);

const dbStatementSerializer: DbStatementSerializer = (_op: string, payload: SerializerPayload) => {
    try {
        if (isEmpty(payload.options)) delete payload.options;
        return JSON.stringify(payload);
    } catch {
        return undefined;
    }
};

const responseHook: MongooseResponseCustomAttributesFunction = (span: Span, response: any) => {
    span.setAttribute(DbExtendedAttribute.DB_RESPONSE, JSON.stringify(response));
};

export const mongooseInstrumentationConfig = (options: AutoInstrumentationOptions): MongooseInstrumentationConfig => ({
    suppressInternalInstrumentation: options.suppressInternalInstrumentation,
    responseHook: options.collectPayloads && callHookOnlyOnRecordingSpan(responseHook),
    dbStatementSerializer,
    moduleVersionAttributeName: GeneralExtendedAttribute.INSTRUMENTED_LIBRARY_VERSION,
});
