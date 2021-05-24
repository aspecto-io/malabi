# OpenTelemetry mocha Instrumentation for Node.js
[![NPM version](https://img.shields.io/npm/v/opentelemetry-instrumentation-mocha.svg)](https://www.npmjs.com/package/opentelemetry-instrumentation-mocha)

This module is a mocha [root hook plugin](https://mochajs.org/#root-hook-plugins) and [reporter](https://mochajs.org/#third-party-reporters) which, in the presence of an installed open-telemetry SDK, provides automatic instrumentation for the [mocha testing framework](https://mochajs.org/).

## Installation

```
npm install --save opentelemetry-instrumentation-mocha
```

## Supported Versions
This instrumentation uses [root hook plugins](https://mochajs.org/#root-hook-plugins) which are available from mocha ^8.0.0

## Usage
For opentelemetry integration to work, you need to configure your mocha run to use otel-plugin and otel-reporter.

- otel-plugin - takes care of setting the otel context during the execution of the test, which create nested spans in the same trace as the test. This is done via the `--require` option for mocha.
- otel-reporter - creates a span for each test, add relevant attributes and status. Reporter is registered via the `--reporter` option for mocha. Since there can only be one reporter, you might want to use [`mocha-multi-reporters`](https://www.npmjs.com/package/mocha-multi-reporters) so you'll get the run report as you're used to.

### CLI
```js
mocha --require ./node_modules/opentelemetry-instrumentation-mocha/dist/src/otel-plugin.js --reporter ./node_modules/opentelemetry-instrumentation-mocha/dist/src/otel-reporter.js
```

### package.json
```json
  "mocha": {
    "require": "opentelemetry-instrumentation-mocha",
    "reporter": "./node_modules/opentelemetry-instrumentation-mocha/dist/src/otel-reporter.js"
  }
```

If you already `require`ing a plugin, you can use JSON array to use multi plugins:
```json
  "mocha": {
    "require": ["some-other-plugin", "opentelemetry-instrumentation-mocha"],
    "reporter": "./node_modules/opentelemetry-instrumentation-mocha/dist/src/otel-reporter.js"
  }
```

For reporter, it is not possible to specify multiple values. Setting otel-reporter will override the default reporter which means you will not get test run reports to you console (or any other report you are using).
You can use [mocha-multi-reporters](https://www.npmjs.com/package/mocha-multi-reporters) for that.
