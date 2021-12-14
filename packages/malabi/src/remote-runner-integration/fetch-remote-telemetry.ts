// import { collectorTraceV1Transform } from "opentelemetry-proto-transformations";
import { initRepository, TelemetryRepository } from 'malabi-telemetry-repository';
import { SpanAttributes, SpanKind } from '@opentelemetry/api';
import { ReadableSpan } from '@opentelemetry/sdk-trace-base';
import { timeInputToHrTime } from '@opentelemetry/core';

// import axios from 'axios';

interface FetchRemoteTelemetryProps {
    portOrBaseUrl: string | number;
    currentTestTraceID: string;
}

const getJaegerValueForTag = (jaegerTagKey, tags) => tags.filter(({ key }) => jaegerTagKey === key)?.[0]?.value;
const convertJaegerTagsToAttributes = (tags): SpanAttributes => {
    const spanAttributes: SpanAttributes = {};
    tags.forEach(({ key, value }) => {
        spanAttributes[key] = value;
    });
    return spanAttributes;
}

const getOtelKindFromJaegerKind = (jaegerKind: string) => {
    switch (jaegerKind) {
        case 'client':
            return SpanKind.CLIENT;
        case 'producer':
            return SpanKind.PRODUCER;
        case 'server':
            return SpanKind.SERVER;
        case 'consumer':
            return SpanKind.CONSUMER;
        default:
            return SpanKind.INTERNAL;
    }
}

const convertJaegerSpanToOtel = (jaegerSpan): ReadableSpan => {
    const durationMillis =  jaegerSpan.duration / 1000;
    const startDateMillis = jaegerSpan.startTime / 1000;
    const endDateMillis = timeInputToHrTime(new Date(startDateMillis + durationMillis));
    return {
        name: jaegerSpan.operationName,
        kind: getOtelKindFromJaegerKind(getJaegerValueForTag('span.kind', jaegerSpan.tags)),
        attributes: convertJaegerTagsToAttributes(jaegerSpan.tags),
        duration: timeInputToHrTime(durationMillis),
        startTime: timeInputToHrTime(startDateMillis),
        endTime: endDateMillis,
        links: [],
        spanContext: () => null,
        instrumentationLibrary: {
            name: getJaegerValueForTag('otel.library.name', jaegerSpan.tags),
            version: getJaegerValueForTag('otel.library.version', jaegerSpan.tags),
        },
        events: [],
        ended: true,
        status: getJaegerValueForTag('otel.status_code', jaegerSpan.tags),
        resource: jaegerSpan.processID,
    }
    // convertedSpan.name = jaegerSpan.operationName;
    // convertedSpan.kind =
    // convertedSpan.attributes = convertJaegerTagsToAttributes(jaegerSpan.tags);
    // convertedSpan.duration = jaegerSpan.duration;
    // convertedSpan.startTime = jaegerSpan.startTime;
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
