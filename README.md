<p align='center'>
    <img src='assets/malabilogo.png' width="400px" alt='Malabi'/>
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

1. An OpenTelemetry SDK Distribution - used to collect any activity in the service under test by instrumenting it. **It is stored in the memory of the asserted service**, and exposes and endpoint for the test runner to access & make assertions.

2. An assertion library for OpenTelemetry data - by using `fetchRemoteTelemetry` function you will get access to any span created by the current test, then you will be able to validate the span and the service behavior

## Getting started
### In the microservice you want to test
1. ```npm install --save malabi``` or ```yarn add malabi```
2. Add the following code at the service initialization, for example: in index.js
```JS
import * as malabi from 'malabi';
malabi.instrument();
malabi.serveMalabiFromHttpApp(18393);

import axios from 'axios';
import express from 'express';
import User from './db';

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
```JS
const SERVICE_UNDER_TEST_PORT = process.env.PORT || 8080;
import axios from 'axios';
import { fetchRemoteTelemetry, clearRemoteTelemetry } from 'malabi';
const getMalabiTelemetryRepository = async () => await fetchRemoteTelemetry(18393);

describe('testing service-under-test remotely', () => {
    beforeEach(async () => {
        // We must reset all collected spans between tests to make sure span aren't leaking between tests.
        await clearRemoteTelemetry(18393);
    });

    it('successful /todo request', async () => {
        // call to the service under test - internally it will call another API to fetch the todo items.
        const res = await axios(`http://localhost:${SERVICE_UNDER_TEST_PORT}/todo`);

        // get spans created from the previous call 
        const repo = await getMalabiTelemetryRepository();
        
        // Validate internal HTTP call
        const todoInteralHTTPCall = repo.spans.outgoing().first;
        expect(todoInteralHTTPCall.httpFullUrl).toBe('https://jsonplaceholder.typicode.com/todos/1')
        expect(todoInteralHTTPCall.statusCode).toBe(200);
    });
});
```

## Documentation
[Click to view documentation](https://aspecto-io.github.io/malabi/index.html)

## Why should you care about Malabi
Most distributed apps developers choose to have some kind of black box test (API, integration, end to end, UI, you name it!).

Black box test create real network activity which is instrumented by OpenTelemetry (which you should have regardless of Malabi).

Imagine that you can take any existing black box test and validate any backend activity created by it.

#### Common use case
You are running an API call that create a new DB record, then you write dedicated test code to fetch the record created and validate it.
Now you can rely on Malabi to validate it with no special code `(await getMalabiTelemetryRepository()).mongodb()`

## <a name="tbt">Trace based assertions explained</a>
Trace-based testing is a method that allows us to improve assertion capabilities by leveraging traces data and make it accessible while setting our expectations from a test. That enables us to **validate essential relationships between software components that otherwise are put to the test only in production**.
Trace-based validation enables developers to become proactive to issues instead of reactive.
## More examples

```JS
import { fetchRemoteTelemetry } from 'malabi';
const getMalabiTelemetryRepository = async () => await fetchRemoteTelemetry(18393);
// get spans created in the context of test
const repo = await getMalabiTelemetryRepository();
const { spans } = repo;

// Validating that /users had ran a single select statement and responded with an array.
const sequelizeActivities = spans.sequelize();
expect(sequelizeActivities.length).toBe(1);
expect(sequelizeActivities.first.dbOperation).toBe("SELECT");
expect(Array.isArray(JSON.parse(sequelizeActivities.first.dbResponse))).toBe(true);
```

[See in-repo live example](https://github.com/aspecto-io/malabi/tree/master/examples/README.md)

## Project Status
Malabi project is actively maintained by [Aspecto](https://www.aspecto.io), and is currently in it's initial days. We would love to receive your feedback, ideas & contributions in the [discussions](https://github.com/aspecto-io/malabi/discussions) section.
