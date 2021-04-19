# malabi-instrumentation-node

Automatic instrumentation for nodejs for the malabi project.

## Configuration
The configuration for this package is global to all instrumentations.

| Options        | Type                                   | Default | Description                                                                                     |
| -------------- | -------------------------------------- | --- | ----------------------------------------------------------------------------------------------- |
| `collectPayloads` | `boolean` | false | Collect operations payloads (request and response) when possible
| `suppressInternalInstrumentation` | `boolean` | true | Don't collect spans for internal implementation operations of instrumented packages |
---

## Instrumentations
Other instrumentations installed via this package:
- [http](https://github.com/open-telemetry/opentelemetry-js/tree/main/packages/opentelemetry-instrumentation-http)
- [ioredis](https://github.com/open-telemetry/opentelemetry-js-contrib/tree/main/plugins/node/opentelemetry-instrumentation-ioredis)

TODO: add the instrumentations from ext-js