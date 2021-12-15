// import { collectorTraceV1Transform } from "opentelemetry-proto-transformations";
import { initRepository, TelemetryRepository } from 'malabi-telemetry-repository';
// import { SpanAttributes, SpanKind } from '@opentelemetry/api';
import { convertJaegerSpanToOtel } from 'opentelemetry-span-transformations';

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
        // const currContext = context.active();
        // const span = trace.getSpan(context.active());
        // const currTraceID = span.spanContext().traceId;
        const baseUrl = typeof portOrBaseUrl === 'string' ? portOrBaseUrl : `http://localhost:${portOrBaseUrl}`;
        console.log('importing axios from fetchRemoteTelem');
        // @ts-ignore
        const axios = require('axios');
        const res = await axios.get(`${baseUrl}/malabi/spans`, {
            transformResponse: (res) => {
                return res;
            },
        });
        // console.log('fetchRemoteTelemetry returning spans. count:', res);
        // const protoFormatted = collectorTraceV1Transform.fromJsonEncodedProtobufFormat(res.data);
        // const spans = collectorTraceV1Transform.fromProtoExportTraceServiceRequest(protoFormatted);
        const spansInJaegerFormat = JSON.parse(res.data).filter(({ traceID }) => traceID === currentTestTraceID)[0].spans;
        return initRepository(spansInJaegerFormat.map(jaegerSpan => convertJaegerSpanToOtel(jaegerSpan)));
    } catch (err) {
        console.log('error while fetching remote telemetry', err);
    }
    return initRepository([]);
};

export default fetchRemoteTelemetry;
