import { JaegerExporter } from '@opentelemetry/exporter-jaeger';

const JAEGER_HOST = process.env.MALABI_JAEGER_HOST || 'http://localhost';
console.log('JAEGER_HOST', JAEGER_HOST);
export const jaegerExporter = new JaegerExporter({
    tags: [],
    host: JAEGER_HOST,
});

export const getJaegerSpans = async (serviceName: string) => {
    const JAEGER_PROTOCOL = process.env.MALABI_JAEGER_QUERY_PROTOCOL || 'http';
    const axios = require('axios');
    const res = await axios.get(`${JAEGER_PROTOCOL}://${JAEGER_HOST}:16686/api/traces?service=${serviceName}`)
    console.log('returning objects', res.data.data.length);
    return res.data.data;
}

