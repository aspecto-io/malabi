import { getNodeAutoInstrumentations } from 'malabi-instrumentation-node';

import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { ParentBasedSampler } from '@opentelemetry/core';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { inMemoryExporter } from '../exporter';
import { jaegerExporter } from '../exporter/jaeger';
import {
    Context,
    Link,
    Sampler,
    SamplingDecision,
    SamplingResult,
    SpanAttributes,
    SpanKind,
    trace,
} from '@opentelemetry/api';
import { SemanticAttributes, SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { Resource } from '@opentelemetry/resources';
import { fetchRemoteTelemetry } from '../remote-runner-integration';
import { TelemetryRepository } from 'malabi-telemetry-repository';

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

export enum StorageBackend {
    InMemory = 'InMemory',
    Jaeger = 'Jaeger',
}

const STORAGE_BACKEND_TO_EXPORTER = {
    [StorageBackend.InMemory]: inMemoryExporter,
    [StorageBackend.Jaeger]: jaegerExporter,
};

export interface InstrumentationConfig {
    serviceName: string;
}

const verifyStorageBackendEnvVar = () => {
    const storageBackendNames = Object.keys(STORAGE_BACKEND_TO_EXPORTER);

    // If MALABI_STORAGE_BACKEND is defined it must be one of the supported values. if not - throw.
    // If MALABI_STORAGE_BACKEND is undefined - default to in memory.
    if (process.env.MALABI_STORAGE_BACKEND && (
        !storageBackendNames.includes(process.env.MALABI_STORAGE_BACKEND))) {
        throw new Error(`Unsupported malabi storage backend. must be either ${JSON.stringify(storageBackendNames)}`);
    }
}

/**
 * Enables OpenTelemetry instrumentation for Malabi. Used in both test runner and service under test
 * @category Main Functions
 * @param InstrumentationConfig Config for creating the instrumentation
 * @param InstrumentationConfig.serviceName The name of the tested service
 */
export const instrument = ({
    serviceName
}: InstrumentationConfig) => {
    verifyStorageBackendEnvVar();

    const tracerProvider = new NodeTracerProvider({
        resource: new Resource({
            [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
        }),
        sampler: new ParentBasedSampler({ root: new MalabiSampler() }),
    });

    const exporter = STORAGE_BACKEND_TO_EXPORTER[process.env.MALABI_STORAGE_BACKEND || StorageBackend.InMemory];
    tracerProvider.addSpanProcessor(new SimpleSpanProcessor(exporter));
    tracerProvider.register();

    registerInstrumentations({
        instrumentations: getNodeAutoInstrumentations({
            collectPayloads: true,
            suppressInternalInstrumentation: true,
        }),
        tracerProvider,
    });
};

/**
 * A wrapper that handles creating a span per test run. returns the spans that were created inside the callback function ready for assertion.
 * @category Main Functions
 * @param callback an async function containing all of the current test's span generating operations(API calls etc)
 */
export const malabi = async (callback): Promise<TelemetryRepository> => {
    return new Promise((resolve, reject) => {
        if (!process.env.MALABI_ENDPOINT_PORT_OR_URL) reject('MALABI_ENDPOINT_PORT_OR_URL was not found. This is the port/url at which the service under test is hosting malabi endpoint');
        // TODO use current package name and version from package.json
        const tracer = trace.getTracer('malabiManualTracer');
        tracer.startActiveSpan('malabiRoot', async (span) => {
            const currTraceID = span.spanContext().traceId;
            try {
                await callback();
            }
            catch (ex) {
                console.error('Error caught inside malabi callback', ex);
                reject(ex);
            }
            span.end();
            const telemetry = await fetchRemoteTelemetry({
                portOrBaseUrl: process.env.MALABI_ENDPOINT_PORT_OR_URL,
                currentTestTraceID: currTraceID,
            });
            resolve(telemetry);
        });
    })
}

