# Running locally
```
lerna bootstrap
yarn watch
```

# Generating Docs
Run this from root of project:
```
typedoc --entryPointStrategy packages 'packages/malabi' 'packages/telemetry-repository/src/SpansRepository.ts' --excludeNotDocumented --excludeInternal
```