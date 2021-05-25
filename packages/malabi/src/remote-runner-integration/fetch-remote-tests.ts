import { ReadableSpan } from "@opentelemetry/tracing";
import { collectorTraceV1Transform } from 'opentelemetry-proto-transformations';
import axios from 'axios';

export const fetchRemoteTests = async (port?: number): Promise<ReadableSpan[]> => {
    try { 
        const _port = port ?? process.env.MALABI_PORT;
        if (_port) throw new Error('Need to provide port');

        const res = await axios.get(`http://localhost:${_port}/malabi/spans`, {
            transformResponse: (res) => {
                return res;
            }
        });
        const protoFormatted = collectorTraceV1Transform.fromJsonEncodedProtobufFormat(res.data);
        const spans = collectorTraceV1Transform.fromProtoExportTraceServiceRequest(protoFormatted);
        console.log(JSON.stringify(spans, null, 4));
        return [];
    } catch (err) {
        console.log('error while fetching remote spans', err);
    }
    return [];
}

