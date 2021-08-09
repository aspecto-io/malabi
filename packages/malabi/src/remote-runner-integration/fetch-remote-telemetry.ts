import { collectorTraceV1Transform } from "opentelemetry-proto-transformations";
import { initRepository, TelemetryRepository } from "malabi-telemetry-repository";

interface FetchRemoteTelemetryProps {
    portOrBaseUrl: string | number;
}

/**
 * Fetches the spans from the exposed malabi spans endpoint
 * @category Main Functions
 * @param fetchRemoteTelemetryProps Props for fetching remote telemetry
 * @param fetchRemoteTelemetryProps.portOrBaseUrl port number, or entire base url, where the endpoint is hosted at.
 */
const fetchRemoteTelemetry = async ({ portOrBaseUrl } : FetchRemoteTelemetryProps): Promise<TelemetryRepository> => {
    try {
        const baseUrl = typeof portOrBaseUrl === 'string' ? portOrBaseUrl : `http://localhost:${portOrBaseUrl}`;        
        const res = await require('axios').get(`${baseUrl}/malabi/spans`, {
            transformResponse: (res) => {
                return res;
            },
        });
        const protoFormatted = collectorTraceV1Transform.fromJsonEncodedProtobufFormat(res.data);
        const spans = collectorTraceV1Transform.fromProtoExportTraceServiceRequest(protoFormatted);
        return initRepository(spans);
    } catch (err) {
        console.log('error while fetching remote spans', err);
    }
    return initRepository([]);
};

export default fetchRemoteTelemetry;
