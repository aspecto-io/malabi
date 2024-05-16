import { ReadableSpan, InMemorySpanExporter } from '@opentelemetry/sdk-trace-base';

export const inMemoryExporter = new InMemorySpanExporter();

/****
 * Fetches spans from in memory exporter, returns ReadableSpan[] filtered by traceID
 * @param traceID
 */
export const getInMemorySpans = ({ traceID }: { traceID: string }): ReadableSpan[] =>
    inMemoryExporter.getFinishedSpans().filter(span => span.spanContext().traceId === traceID);

