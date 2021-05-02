import { getNodeAutoInstrumentations } from 'malabi-instrumentation-node';

import { NodeTracerProvider } from '@opentelemetry/node';
import { SimpleSpanProcessor } from '@opentelemetry/tracing';
import { ParentBasedSampler } from '@opentelemetry/core';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { inMemoryExporter } from '../exporter';
import { Context, Link, Sampler, SamplingDecision, SamplingResult, SpanAttributes, SpanKind } from '@opentelemetry/api';
import { SemanticAttributes } from '@opentelemetry/semantic-conventions';

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

export const instrument = () => {
    const tracerProvider = new NodeTracerProvider({
        sampler: new ParentBasedSampler({ root: new MalabiSampler() }),
    });
    tracerProvider.addSpanProcessor(new SimpleSpanProcessor(inMemoryExporter));
    tracerProvider.register();

    registerInstrumentations({
        instrumentations: getNodeAutoInstrumentations({
            collectPayloads: true,
            suppressInternalInstrumentation: true,
        }),
        tracerProvider
    });
};
