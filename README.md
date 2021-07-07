<img src="https://user-images.githubusercontent.com/16322616/116516537-6374d180-a8d6-11eb-9c57-a5334729d7f8.png" width="400px"/>

# Tracing Based JavaScript Assertions
opentelemetry &lt;-> testing integration for nodejs

## Run example project tests

1. In the **project root** run `yarn` to install dependencies, followed by `yarn build`.

2. Start the **service-under-test** by running:
```sh
yarn --cwd examples/service-under-test start
```
3. In a different terminal process, run the tests:
```sh
yarn --cwd examples/tests-runner test:example
```