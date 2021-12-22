import { InMemorySpanExporter } from '@opentelemetry/tracing';

export const inMemoryExporter = new InMemorySpanExporter();

export const getInMemorySpans = () => inMemoryExporter.getFinishedSpans();
