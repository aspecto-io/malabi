import { getNodeAutoInstrumentations } from "malabi-instrumentation-node";

import { NodeTracerProvider } from "@opentelemetry/node";
import {
  SimpleSpanProcessor,
  InMemorySpanExporter,
} from "@opentelemetry/tracing";
import { registerInstrumentations } from "@opentelemetry/instrumentation";

const inMemoryExporter = new InMemorySpanExporter();

const provider = new NodeTracerProvider();
provider.addSpanProcessor(new SimpleSpanProcessor(inMemoryExporter));
provider.register();

registerInstrumentations({
  instrumentations: getNodeAutoInstrumentations({
    collectPayloads: true,
    suppressInternalInstrumentation: true,
  }),
});
