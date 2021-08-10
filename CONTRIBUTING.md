# Running locally
```
lerna bootstrap
yarn watch
```

# Generating Docs
1. Run this:
```
jsdoc -c "./jsdoc.json" ./packages/malabi/src/remote-runner-integration/fetch-remote-telemetry.ts ./packages/malabi/src/remote-runner-integration/clear-remote-telemetry.ts ./packages/telemetry-repository/src/TelemetryRepository.ts ./packages/telemetry-repository/src/SpansRepository.ts
```
2. Then commit output to github.