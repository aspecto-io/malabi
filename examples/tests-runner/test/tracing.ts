// malabi
import { instrument } from 'malabi';

console.log('reached tracing');
// console.log('req.cache', require.cache);
// console.log('req.cache', Object.keys(require.cache).filter(key => key.indexOf('http') !== -1));
instrument({
    serviceName: 'tests-runner',
});
// instrument();

console.log('after instrument');

// link:./../../../opentelemetry-ext-js/packages/span-transformations
// no malabi
// import { getNodeAutoInstrumentations } from 'malabi-instrumentation-node';
//
// import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
// import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
// import { ParentBasedSampler } from '@opentelemetry/core';
// import { registerInstrumentations } from '@opentelemetry/instrumentation';
// // import { inMemoryExporter } from '../exporter';
// import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
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
//
// export const jaegerExporter = new JaegerExporter(options);
// // const { ConsoleSpanExporter } = require('@opentelemetry/sdk-trace-base');
// // const { SemanticResourceAttributes: ResourceAttributesSC } = require('@opentelemetry/semantic-conventions');
// import {
//     context,
//     // Link,
//     // Sampler,
//     SamplingDecision,
//     // SamplingResult,
//     // SpanAttributes,
//     // SpanKind,
//     // trace,
// } from '@opentelemetry/api';
// import { SemanticAttributes } from '@opentelemetry/semantic-conventions';
// import { Resource } from '@opentelemetry/resources';
// // import { fetchRemoteTelemetry } from '../remote-runner-integration';
// // /Users/tom/code/aspecto/malabi/node_modules/@opentelemetry/sdk-trace-node/node_modules/@opentelemetry/sdk-trace-base
// // allow all but filter out malabi requests.
// class MalabiSampler {
//     shouldSample(
//         _context,
//         _traceId,
//         _spanName,
//         _spanKind,
//         attributes,
//         _links
//     ) {
//         const httpTarget = attributes[SemanticAttributes.HTTP_TARGET];
//         return {
//             decision: httpTarget && httpTarget.startsWith('/malabi')
//                 ? SamplingDecision.NOT_RECORD
//                 : SamplingDecision.RECORD_AND_SAMPLED,
//         };
//     }
//
//     toString() {
//         return 'malabi sampler';
//     }
// }
//
// const tracerProvider = new NodeTracerProvider({
//     resource: new Resource({
//         // TODO this should use semantic conventions
//         'service.name': 'tomservice',
//     }),
//     sampler: new ParentBasedSampler({ root: new MalabiSampler() }),
// });
//
// export const instrument = () => {
//     console.log('started to instrument');
//     tracerProvider.addSpanProcessor(new SimpleSpanProcessor(jaegerExporter));
//     tracerProvider.register();
//
//     registerInstrumentations({
//         instrumentations: getNodeAutoInstrumentations({
//             collectPayloads: true,
//             suppressInternalInstrumentation: true,
//         }),
//         tracerProvider,
//     });
// };
//
// instrument();