import { collectorTraceV1Transform } from 'opentelemetry-proto-transformations';
import { initRepository, TelemetryRepository } from 'malabi-telemetry-repository';

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
        const baseUrl = typeof portOrBaseUrl === 'string' ? portOrBaseUrl : `http://localhost:${portOrBaseUrl}`;
        const axios = require('axios');
        const res = await axios.get(`${baseUrl}/malabi/spans`, {
            transformResponse: (res: any) => {
                return res;
            },
            params: {
                traceID: currentTestTraceID,
            }
        });

        const protoFormatted = collectorTraceV1Transform.fromJsonEncodedProtobufFormat(res.data);
        const spans = collectorTraceV1Transform.fromProtoExportTraceServiceRequest(protoFormatted);

        return initRepository(spans);
    } catch (err) {
        console.error('error while fetching remote telemetry', err);
    }
    return initRepository([]);
};

export default fetchRemoteTelemetry;
