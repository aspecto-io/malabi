import { InMemorySpanExporter } from "@opentelemetry/tracing";

export const inMemoryExporter = new InMemorySpanExporter();

export const getSpans = () => inMemoryExporter.getFinishedSpans();
export const resetSpans = () => inMemoryExporter.reset();
