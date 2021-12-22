import { collectorTraceV1Transform } from 'opentelemetry-proto-transformations';
import { initRepository, TelemetryRepository } from 'malabi-telemetry-repository';
import { convertJaegerSpanToOtelReadableSpan } from 'opentelemetry-span-transformations';
import { StorageBackend } from '../instrumentation';

interface FetchRemoteTelemetryProps {
    portOrBaseUrl: string | number;
    currentTestTraceID: string;
}

/**
 * Fetches the spans from the exposed malabi spans endpoint
 * @category Main Functions
 * @param fetchRemoteTelemetryProps Props for fetching remote telemetry
 * @param fetchRemoteTelemetryProps.portOrBaseUrl port number, or entire base url, where the endpoint is hosted at.
 */
const fetchRemoteTelemetry = async ({ portOrBaseUrl, currentTestTraceID } : FetchRemoteTelemetryProps): Promise<TelemetryRepository> => {
    try {
        console.log('currentTestTraceID', currentTestTraceID);
        const baseUrl = typeof portOrBaseUrl === 'string' ? portOrBaseUrl : `http://localhost:${portOrBaseUrl}`;
        console.log('importing axios from fetchRemoteTelem');
        const axios = require('axios');
        const res = await axios.get(`${baseUrl}/malabi/spans`, {
            transformResponse: (res) => {
                return res;
            },
        });

        let spans;
        if (process.env.MALABI_STORAGE_BACKEND === StorageBackend.InMemory) {
            const protoFormatted = collectorTraceV1Transform.fromJsonEncodedProtobufFormat(res.data);
            spans = collectorTraceV1Transform.fromProtoExportTraceServiceRequest(protoFormatted).filter(span => span.spanContext().traceId === currentTestTraceID);
        } else if (process.env.MALABI_STORAGE_BACKEND === StorageBackend.Jaeger) {
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
