import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { convertJaegerSpanToOtelReadableSpan } from 'opentelemetry-span-transformations';
import { ReadableSpan } from '@opentelemetry/sdk-trace-base';

const JAEGER_QUERY_HOST = process.env.MALABI_JAEGER_QUERY_HOST || 'localhost';
const JAEGER_AGENT_PORT = process.env.OTEL_EXPORTER_JAEGER_AGENT_PORT ? (parseInt(process.env.OTEL_EXPORTER_JAEGER_AGENT_PORT)) : 6832;
export const jaegerExporter = new JaegerExporter({
    tags: [],
    port: JAEGER_AGENT_PORT
});

/****
 * Fetches spans from jaeger internal JSON API by service, returns ReadableSpan[] filtered by traceID
 * @param serviceName
 * @param traceID
 */
export const getJaegerSpans = async ({
    serviceName,
    traceID,
}: { serviceName: string, traceID: string }): Promise<ReadableSpan[]> => {
    const JAEGER_QUERY_PROTOCOL = process.env.MALABI_JAEGER_QUERY_PROTOCOL || 'http';
    const JAEGER_QUERY_PORT = process.env.MALABI_JAEGER_QUERY_PORT || '16686';
    const axios = require('axios');
    const res = await axios.get(`${JAEGER_QUERY_PROTOCOL}://${JAEGER_QUERY_HOST}:${JAEGER_QUERY_PORT}/api/traces?service=${serviceName}`)
    const spansInJaegerFormat = res.data.data.find(({ traceID: id }) => id === traceID).spans;
    return spansInJaegerFormat.map(jaegerSpan => convertJaegerSpanToOtelReadableSpan(jaegerSpan));
}

