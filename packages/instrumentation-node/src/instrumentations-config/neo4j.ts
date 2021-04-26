import { Neo4jInstrumentationConfig } from 'opentelemetry-instrumentation-neo4j';
import { DbExtendedAttribute, GeneralExtendedAttribute } from '../enums';
import { AutoInstrumentationOptions } from '../types';
import { callHookOnlyOnRecordingSpan } from '../payload-collection/recording-span';

export const neo4jInstrumentationConfig = (options: AutoInstrumentationOptions): Neo4jInstrumentationConfig => ({
    ignoreOrphanedSpans: true,
    moduleVersionAttributeName: GeneralExtendedAttribute.INSTRUMENTED_LIBRARY_VERSION,
    responseHook:
        options.collectPayloads &&
        callHookOnlyOnRecordingSpan((span, response) => {
            span.setAttribute(
                DbExtendedAttribute.DB_RESPONSE,
                JSON.stringify(response.records.map((r) => r.toObject()))
            );
        }),
});
