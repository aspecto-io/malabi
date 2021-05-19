
const { SimpleSpanProcessor, InMemorySpanExporter } = require('@opentelemetry/tracing');
const { NodeTracerProvider } = require('@opentelemetry/node');

const provider = new NodeTracerProvider();

const memoryExporter = new InMemorySpanExporter();
provider.addSpanProcessor(new SimpleSpanProcessor(memoryExporter));
provider.register();

module.exports = memoryExporter;