import { getNodeAutoInstrumentations } from 'malabi-instrumentation-node';

import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { ParentBasedSampler } from '@opentelemetry/core';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
// import { inMemoryExporter } from '../exporter';
import { jaegerExporter } from '../exporter/jaeger';
// const { ConsoleSpanExporter } = require('@opentelemetry/sdk-trace-base');
// const { SemanticResourceAttributes: ResourceAttributesSC } = require('@opentelemetry/semantic-conventions');
import {
    // context,
    Context,
    Link,
    Sampler,
    SamplingDecision,
    SamplingResult,
    SpanAttributes,
    SpanKind,
    trace,
} from '@opentelemetry/api';
import { SemanticAttributes } from '@opentelemetry/semantic-conventions';
import { Resource } from '@opentelemetry/resources';
import { fetchRemoteTelemetry } from '../remote-runner-integration';
import { TelemetryRepository } from 'malabi-telemetry-repository';
// /Users/tom/code/aspecto/malabi/node_modules/@opentelemetry/sdk-trace-node/node_modules/@opentelemetry/sdk-trace-base
// allow all but filter out malabi requests.
class MalabiSampler implements Sampler {
    shouldSample(
        _context: Context,
        _traceId: string,
        _spanName: string,
        _spanKind: SpanKind,
        attributes: SpanAttributes,
        _links: Link[]
    ): SamplingResult {
        const httpTarget = attributes[SemanticAttributes.HTTP_TARGET] as string;
        return {
            decision: httpTarget?.startsWith('/malabi')
                ? SamplingDecision.NOT_RECORD
                : SamplingDecision.RECORD_AND_SAMPLED,
        };
    }

    toString(): string {
        return 'malabi sampler';
    }
}

const tracerProvider = new NodeTracerProvider({
    resource: new Resource({
        // TODO this should use semantic conventions
        // TODO change this servicename
        'service.name': 'tomservice',
    }),
    sampler: new ParentBasedSampler({ root: new MalabiSampler() }),
});

export const instrument = () => {
    console.log('started to instrument');
    tracerProvider.addSpanProcessor(new SimpleSpanProcessor(jaegerExporter));
    tracerProvider.register();

    registerInstrumentations({
        instrumentations: getNodeAutoInstrumentations({
            collectPayloads: true,
            suppressInternalInstrumentation: true,
        }),
        tracerProvider,
    });
};

export const malabi = async (callback): Promise<TelemetryRepository> => {
    return new Promise((resolve) => {
        const tracer = trace.getTracer('sometracer');
        // const span = tracer.startSpan('malabiRoot', {}, context.active());
        // context.with()

        tracer.startActiveSpan('malabiRoot', async (span) => {
            const currTraceID = span.spanContext().traceId;

            // const fetchTelem = async () => {
            //     // const currContext = context.active();
            //     // maybe we need timeout here (check flush interval of jaeger instead)
            //     // await new Promise(resolve => setTimeout(resolve, 5000))
            //     span.end();
            //     const telemetry = await fetchRemoteTelemetry({ portOrBaseUrl: 18393, currentTestTraceID: currTraceID });
            //     console.log('telemetry', telemetry);
            //     resolve(telemetry);
            //     // return telemetry;
            // }
            // const currContext = context.active();
            // const currSpan = trace.getSpan(context.active());
            await callback();
            span.end();
            console.log('1111currTraceID', currTraceID);
            // await new Promise(resolve => setTimeout(resolve, 5000))
            const telemetry = await fetchRemoteTelemetry({ portOrBaseUrl: 18393, currentTestTraceID: currTraceID });
            resolve(telemetry);
        });
    })
}

// export const malabi = async (callback) => {
//     const tracer = trace.getTracer('sometracer');
//     await callback(async () => {
//         await fetchRemoteTelemetry({ portOrBaseUrl: 18393 })
//     });
// }

