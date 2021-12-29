import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { InMemorySpanExporter, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { AutoInstrumentationOptions, getNodeAutoInstrumentations } from '../src';

export const memoryExporter = new InMemorySpanExporter();
const provider = new NodeTracerProvider();
provider.addSpanProcessor(new SimpleSpanProcessor(memoryExporter));
provider.register();

export const registerAutoInstrumentationsForTests = (options: AutoInstrumentationOptions) => {
    registerInstrumentations({ instrumentations: getNodeAutoInstrumentations(options) });
};
