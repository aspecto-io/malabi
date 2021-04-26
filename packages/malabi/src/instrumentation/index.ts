import { getNodeAutoInstrumentations } from "malabi-instrumentation-node";

import { NodeTracerProvider } from "@opentelemetry/node";
import {
  SimpleSpanProcessor,
} from "@opentelemetry/tracing";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { inMemoryExporter } from "../exporter";

export const instrument = () => {
    const provider = new NodeTracerProvider();
    provider.addSpanProcessor(new SimpleSpanProcessor(inMemoryExporter));
    provider.register();
    
    registerInstrumentations({
      instrumentations: getNodeAutoInstrumentations({
        collectPayloads: true,
        suppressInternalInstrumentation: true,
      }),
    });    
}