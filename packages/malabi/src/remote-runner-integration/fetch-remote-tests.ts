import { ReadableSpan } from "@opentelemetry/tracing";
// import { fromProtoTraceServiceRequest } from 'opentelemetry-proto-transformations/src/v1/decode';
import axios from 'axios';

export const fetchRemoteTests = async (port: number): Promise<ReadableSpan[]> => {
    try { 
        const res = await axios.get(`http://localhost:${port}/malabi/spans`);
        return [];
    } catch (err) {
        console.log('error while fetching remote spans');
    }
    return [];
}

