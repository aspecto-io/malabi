import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
// import { ReadableSpan } from '@opentelemetry/tracing';
// import { inMemoryExporter } from './index';
// import axios from 'axios';

// const options = {
//     tags: [], // optional
//     // You can use the default UDPSender
//     // host: 'localhost', // optional
//     // port: 6832, // optional
//     // OR you can use the HTTPSender as follows
//     // endpoint: 'http://localhost:14268/api/traces',
//     // maxPacketSize: 65000 // optional
//     serviceName: 'tomservice'
// }

export const jaegerExporter = new JaegerExporter({
    tags: [], // optional
    // You can use the default UDPSender
    // host: 'localhost', // optional
    // port: 6832, // optional
    // OR you can use the HTTPSender as follows
    // endpoint: 'http://localhost:14268/api/traces',
    // maxPacketSize: 65000 // optional
    // serviceName: serviceName1,
});

export const getJaegerSpans = async (serviceName: string) => {
    const axios = require('axios');
    const res = await axios.get(`http://localhost:16686/api/traces?service=${serviceName}`)
    console.log('returning objects', res.data.data.length);
    return res.data.data;
}

