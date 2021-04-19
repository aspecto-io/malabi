import { Span } from '@opentelemetry/api';
import { ElasticsearchInstrumentationConfig, ResponseHook } from 'opentelemetry-instrumentation-elasticsearch';
import { DbExtendedAttribute, GeneralExtendedAttribute } from '../enums';
import { AutoInstrumentationOptions } from '../types';
import { callHookOnlyOnRecordingSpan } from '../payload-collection/recording-span';

const responseHook: ResponseHook = (span: Span, response: any) => {
    span.setAttribute(DbExtendedAttribute.DB_RESPONSE, JSON.stringify(response));
};

export const elasticsearchInstrumentationConfig = (options: AutoInstrumentationOptions): ElasticsearchInstrumentationConfig => ({
    moduleVersionAttributeName: GeneralExtendedAttribute.INSTRUMENTED_LIBRARY_VERSION,
    suppressInternalInstrumentation: options.suppressInternalInstrumentation,
    responseHook: options.collectPayloads && callHookOnlyOnRecordingSpan(responseHook),
});
