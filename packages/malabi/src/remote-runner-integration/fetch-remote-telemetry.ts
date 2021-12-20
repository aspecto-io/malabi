import { collectorTraceV1Transform } from 'opentelemetry-proto-transformations';
import { initRepository, TelemetryRepository } from 'malabi-telemetry-repository';
// import { SpanAttributes, SpanKind } from '@opentelemetry/api';
import { convertJaegerSpanToOtelReadableSpan } from 'opentelemetry-span-transformations';
import { StorageBackend } from '../instrumentation';

interface FetchRemoteTelemetryProps {
    portOrBaseUrl: string | number;
    currentTestTraceID: string;
    storageBackend: StorageBackend;
}

/**
 * Fetches the spans from the exposed malabi spans endpoint
 * @category Main Functions
 * @param fetchRemoteTelemetryProps Props for fetching remote telemetry
 * @param fetchRemoteTelemetryProps.portOrBaseUrl port number, or entire base url, where the endpoint is hosted at.
 */
const fetchRemoteTelemetry = async ({ portOrBaseUrl, currentTestTraceID, storageBackend } : FetchRemoteTelemetryProps): Promise<TelemetryRepository> => {
    try {
        console.log('currentTestTraceID', currentTestTraceID);
        // const currContext = context.active();
        // const span = trace.getSpan(context.active());
        // const currTraceID = span.spanContext().traceId;
        const baseUrl = typeof portOrBaseUrl === 'string' ? portOrBaseUrl : `http://localhost:${portOrBaseUrl}`;
        console.log('importing axios from fetchRemoteTelem');
        // @ts-ignore
        const axios = require('axios');
        // await new Promise(resolve => setTimeout(resolve, 5000))
        const res = await axios.get(`${baseUrl}/malabi/spans`, {
            transformResponse: (res) => {
                return res;
            },
        });
        // console.log('fetchRemoteTelemetry returning spans. count:', res);
        let spans;

        if (storageBackend === StorageBackend.InMemory) {
            const protoFormatted = collectorTraceV1Transform.fromJsonEncodedProtobufFormat(res.data);
            // TODO filter by currentTestTraceID
            spans = collectorTraceV1Transform.fromProtoExportTraceServiceRequest(protoFormatted);
        } else if (storageBackend === StorageBackend.Jaeger) {
            const spansInJaegerFormat = JSON.parse(res.data).filter(({ traceID }) => traceID === currentTestTraceID)[0].spans;
            spans = spansInJaegerFormat.map(jaegerSpan => convertJaegerSpanToOtelReadableSpan(jaegerSpan));
        }

        return initRepository(spans);
    } catch (err) {
        console.log('error while fetching remote telemetry', err);
    }
    return initRepository([]);
};

export default fetchRemoteTelemetry;
