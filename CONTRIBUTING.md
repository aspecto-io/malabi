# Running locally
```
lerna bootstrap
yarn watch
```

# Generating Docs
16.8.21 - Temporarily not available due to better-docs causing TS issues so it was removed. if needed, do this(and remove after generating, until we fix this)
```
yarn add better-docs -W
```
1. Copy the index.html file from docs to the side
2. Run this:
```
jsdoc -c "./jsdoc.json" ./packages/malabi/src/remote-runner-integration/fetch-remote-telemetry.ts ./packages/malabi/src/instrumentation/index.ts ./packages/telemetry-repository/src/TelemetryRepository.ts ./packages/telemetry-repository/src/SpansRepository.ts
```
3. Replace the index.html file that was generated with the old version.
4. Then commit output to github. 
* If functions are created as consts, this is a bug in the lib. until we find a different one remove the export from before the const name, generate the docs and revert.
