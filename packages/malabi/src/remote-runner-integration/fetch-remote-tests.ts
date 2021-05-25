import { ReadableSpan } from "@opentelemetry/tracing";
import {
    fromProtoExportTraceServiceRequest,
    fromJsonEncodedProtobufFormat,
} from 'opentelemetry-proto-transformations/src/opentelemetry/proto/collector/trace/v1/transform';
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
        const protoFormatted = fromJsonEncodedProtobufFormat(res.data);
        const spans = fromProtoExportTraceServiceRequest(protoFormatted);
        console.log(JSON.stringify(spans, null, 4));
        return [];
    } catch (err) {
        console.log('error while fetching remote spans', err);
    }
    return [];
}

