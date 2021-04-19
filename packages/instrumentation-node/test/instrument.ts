import { NodeTracerProvider } from '@opentelemetry/node';
import { InMemorySpanExporter, SimpleSpanProcessor } from '@opentelemetry/tracing';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { AutoInstrumentationOptions, getNodeAutoInstrumentations } from '../src';

export const memoryExporter = new InMemorySpanExporter();
const provider = new NodeTracerProvider();
provider.addSpanProcessor(new SimpleSpanProcessor(memoryExporter));
provider.register();

export const registerAutoInstrumentationsForTests = (options: AutoInstrumentationOptions) => {
    registerInstrumentations({ instrumentations: getNodeAutoInstrumentations(options) });
};
