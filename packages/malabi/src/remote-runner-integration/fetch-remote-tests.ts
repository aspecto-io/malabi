import { collectorTraceV1Transform } from 'opentelemetry-proto-transformations';
import { extract, MalabiExtract } from 'malabi-extract';
import axios from 'axios';

export const fetchRemoteTests = async (portOrBaseUrl: string | number): Promise<MalabiExtract> => {
    try {
        const baseUrl = typeof portOrBaseUrl === 'string' ? portOrBaseUrl : `http://localhost:${portOrBaseUrl}`;
        const res = await axios.get(`${baseUrl}/malabi/spans`, {
            transformResponse: (res) => {
                return res;
            },
        });
        const protoFormatted = collectorTraceV1Transform.fromJsonEncodedProtobufFormat(res.data);
        const spans = collectorTraceV1Transform.fromProtoExportTraceServiceRequest(protoFormatted);
        return extract(spans);
    } catch (err) {
        console.log('error while fetching remote spans', err);
    }
    return extract([]);
};
