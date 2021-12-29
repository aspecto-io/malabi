<p align='center'>
    <img src='../../assets/malabilogo.png' width="400px" alt='Malabi'/>
</p>
<p align='center'>
    OpenTelemetry based Javascript test framework
</p>

<a href="https://github.com/aspecto-io/malabi/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/aspecto-io/malabi" alt="Malabi is released under the Apache-2.0 license." />
</a>

# Description
This library introduces a new way of testing services: <a href="#tbt">**Trace-based testing**</a> (TBT). It is very useful when you want to validate integration between different parts. For example: make sure elasticsearch received the correct params on insert.

- 💻 **Developer friendly**: Built by developers, for developers who love distributed applications.

- ✅ **Validate integration**: Access to validate any backend interaction, fast, simple and reliable.

- 🔗 **OpenTelemetry based**: Built based on OpenTelemetry to match the characteristics of distributed apps.


## How it works
<img src='assets/diagram.png' alt='How it work diagram'>

There are two main components to Malabi:

1. An OpenTelemetry SDK Distribution - used to collect any activity in the service under test by instrumenting it. **It is stored in the memory of the asserted service or in a Jaeger instance **, and exposes and endpoint for the test runner to access & make assertions.

2. An assertion library for OpenTelemetry data - by using the `malabi` wrapper function you will get access to any span created by the current test, then you will be able to validate the span and the service behavior

## Getting started
### In the microservice you want to test
1. ```npm install --save malabi``` or ```yarn add malabi```
2. Add the following code at the service initialization, for example: in index.js. needs to be before any other imports to work properly.
```JS
import { instrument, serveMalabiFromHttpApp } from 'malabi';
const instrumentationConfig = {
    serviceName: 'service-under-test',
};
instrument(instrumentationConfig);
serveMalabiFromHttpApp(18393, instrumentationConfig);

import axios from 'axios';
import express from 'express';
import User from "./db";
const PORT = process.env.PORT || 8080;

const app = express();

app.get('/todo', async (req, res) => {
    try {
        const todoItem = await axios('https://jsonplaceholder.typicode.com/todos/1');
        res.json({
            title: todoItem.data.title,
        });
    } catch (e) {
        res.sendStatus(500);
        console.error(e, e);
    }
});
```

## In your test file
Create a tracing.ts file to set up instrumentation on the tests runner(this enables us to separate spans created in one test from other tests' spans from the other):
```JS
import { instrument } from 'malabi';

instrument({
    serviceName: 'tests-runner',
});
```

And this is how the test file looks like(service-under-test.spec.ts):
Note: this should be run with node --require, like this:
Also, notice you must provide the MALABI_ENDPOINT_PORT_OR_URL(must start with http for url) environment variable which is where the service under test exposes the malabi endpoint.
```MALABI_ENDPOINT_PORT_OR_URL=http://localhost:18393 ts-mocha --paths "./test/*.ts" --require "./test/tracing.ts"```
Or alternatively just with port(assuming localhost by default):
```MALABI_ENDPOINT_PORT_OR_URL=18393 ts-mocha --paths "./test/*.ts" --require "./test/tracing.ts"```

```JS
const SERVICE_UNDER_TEST_PORT = process.env.PORT || 8080;
import { malabi } from 'malabi';

import { expect } from 'chai';
import axios from 'axios';

describe('testing service-under-test remotely', () => {
    it('successful /todo request', async () => {
        // get spans created from the previous call
        const telemetryRepo = await malabi(async () => {
            await axios(`http://localhost:${SERVICE_UNDER_TEST_PORT}/todo`);
        });

        // Validate internal HTTP call
        const todoInternalHTTPCall = telemetryRepo.spans.outgoing().first;
        expect(todoInternalHTTPCall.httpFullUrl).equals('https://jsonplaceholder.typicode.com/todos/1')
        expect(todoInternalHTTPCall.statusCode).equals(200);
    });
});
```

Notice the usage of the malabi function - any piece of code that we put inside the callback given to this function would be instrumented as part
of a newly created trace (created by malabi), and the return value would be the telemetry repository for this test, meaning the 
Open Telemetry data you can make assertions on (the spans that were created because of the code you put in the callback).

To sum it up, be sure that whenever you want to make assertions on a span - the code that created it must be in the callback the malabi function receives, and the malabi function returns the spans created.

## Storage Backends
Malabi supports 2 types of storage backends for the telemetry data created in your test (spans and traces).
1. InMemory
   In this mode malabi stores the data in memory.

To select this mode, set MALABI_STORAGE_BACKEND env var to `InMemory`
2. Jaeger
   To select this mode, set MALABI_STORAGE_BACKEND env var to `Jaeger` when running your service under test. 
   Also, you can control additional env vars here:
   1. OTEL_EXPORTER_JAEGER_AGENT_HOST - lets you control the hostname of the jaeger agent. it must be running somewhere for this mode to work and it's up to you to make it run. default: `localhost`
      Example values: `localhost`,`example.com`.
   2. OTEL_EXPORTER_JAEGER_AGENT_PORT - port of jaeger agent. default: `6832`
   3. MALABI_JAEGER_QUERY_PROTOCOL - the protocol used to query jaeger API for the spans. Either `http`(default) or `https`.
   4. MALABI_JAEGER_QUERY_PORT - the port which we use to query jaeger. default: `16686`
   5. MALABI_JAEGER_QUERY_HOST - ets you control the hostname of the jaeger query api. default: `localhost`
   
For both storage backends, malabi creates an endpoint (hosted inside the service-under-test) for the test runner to call query.

## Caveat: Usage with Jest

Currently, Jest does not play out well with OpenTelemetry due to Jest's modifications of the way modules are required and OTEL's usage of 
require in the middle. 

Until this is fixed, we recommend using Malabi with Mocha instead of Jest.

## Documentation
[Click to view documentation](https://aspecto-io.github.io/malabi/index.html)

## Why should you care about Malabi
Most distributed apps developers choose to have some kind of black box test (API, integration, end to end, UI, you name it!).

Black box test create real network activity which is instrumented by OpenTelemetry (which you should have regardless of Malabi).

Imagine that you can take any existing black box test and validate any backend activity created by it.

#### Common use case
You are running an API call that create a new DB record, then you write dedicated test code to fetch the record created and validate it.
Now you can rely on Malabi to validate that mongo got the right data with no special code.

## <a name="tbt">Trace based testing explained</a>
Trace-based testing is a method that allows us to improve assertion capabilities by leveraging traces data and make it accessible while setting our expectations from a test. That enables us to **validate essential relationships between software components that otherwise are put to the test only in production**.
Trace-based validation enables developers to become proactive to issues instead of reactive.
## More examples

```JS
import { malabi } from 'malabi';

it('should select from db', async () => {
    const { spans } = await malabi(async () => {
        // some code here that makes db operations with sequelize
    });
    
    // Validating that /users had ran a single select statement and responded with an array.
    const sequelizeActivities = spans.sequelize();
    expect(sequelizeActivities.length).toBe(1);
    expect(sequelizeActivities.first.dbOperation).toBe("SELECT");
    expect(Array.isArray(JSON.parse(sequelizeActivities.first.dbResponse))).toBe(true);
});
```

[See in-repo live example](https://github.com/aspecto-io/malabi/tree/master/examples/README.md)

## Project Status
Malabi project is actively maintained by [Aspecto](https://www.aspecto.io), and is currently in it's initial days. We would love to receive your feedback, ideas & contributions in the [discussions](https://github.com/aspecto-io/malabi/discussions) section.
