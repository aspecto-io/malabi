# Running locally
```
lerna bootstrap
yarn watch
```

# Generating Docs
```
jsdoc -c "./jsdoc.json" /Users/tom/code/aspecto/malabi/packages/malabi/src/remote-runner-integration/fetch-remote-telemetry.ts /Users/tom/code/aspecto/malabi/packages/malabi/src/remote-runner-integration/clear-remote-telemetry.ts /Users/tom/code/aspecto/malabi/packages/telemetry-repository/src/TelemetryRepository.ts
```