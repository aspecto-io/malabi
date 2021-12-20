import { JaegerExporter } from '@opentelemetry/exporter-jaeger';

export const jaegerExporter = new JaegerExporter({
    tags: [],
});

export const getJaegerSpans = async (serviceName: string) => {
    const axios = require('axios');
    const res = await axios.get(`http://localhost:16686/api/traces?service=${serviceName}`)
    console.log('returning objects', res.data.data.length);
    return res.data.data;
}

