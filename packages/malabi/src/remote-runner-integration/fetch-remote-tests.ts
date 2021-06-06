import { ReadableSpan } from "@opentelemetry/tracing";
import { collectorTraceV1Transform } from 'opentelemetry-proto-transformations';
import axios from 'axios';

export const fetchRemoteTests = async (portOrBaseUrl: string | number): Promise<ReadableSpan[]> => {
    try { 
        const baseUrl = typeof portOrBaseUrl === 'string' ? portOrBaseUrl : `http://localhost:${portOrBaseUrl}`
        const res = await axios.get(`${baseUrl}/malabi/spans`, {
            transformResponse: (res) => {
                return res;
            }
        });
        const protoFormatted = collectorTraceV1Transform.fromJsonEncodedProtobufFormat(res.data);
        const spans = collectorTraceV1Transform.fromProtoExportTraceServiceRequest(protoFormatted);
        console.log(JSON.stringify(spans, null, 4));
        return spans;
    } catch (err) {
        console.log('error while fetching remote spans', err);
    }
    return [];
}

