## What do we have here
1. A microservice called `service-under-test` with `malabi` installed 
2. A test runner validating the microservices (called `tests-runner`) 

## Take it for a test ride
You can find an example service and test to show case how it works.

1. In the **project root** run `yarn` to install dependencies, followed by `yarn build`.

2. Start the **service-under-test** by running:
```sh
yarn --cwd examples/service-under-test start
```
3. In a different terminal process, run the tests:
```sh
yarn --cwd examples/tests-runner test:example
```