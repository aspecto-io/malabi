import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { convertJaegerSpanToOtelReadableSpan } from 'opentelemetry-span-transformations';
import { ReadableSpan } from '@opentelemetry/sdk-trace-base';

const JAEGER_HOST = process.env.MALABI_JAEGER_HOST || 'localhost';
export const jaegerExporter = new JaegerExporter({
    tags: [],
    host: JAEGER_HOST,
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
    const JAEGER_PROTOCOL = process.env.MALABI_JAEGER_QUERY_PROTOCOL || 'http';
    const axios = require('axios');
    const res = await axios.get(`${JAEGER_PROTOCOL}://${JAEGER_HOST}:16686/api/traces?service=${serviceName}`)
    const spansInJaegerFormat = res.data.data.find(({ traceID: id }) => id === traceID).spans;
    return spansInJaegerFormat.map(jaegerSpan => convertJaegerSpanToOtelReadableSpan(jaegerSpan));
}

