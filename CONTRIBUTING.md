# Running locally
```
lerna bootstrap
yarn watch
```

# Generating Docs
```
jsdoc -c "./jsdoc.json" /Users/tom/code/aspecto/malabi/packages/malabi/src/remote-runner-integration/fetch-remote-tests.ts
jsdoc -c "./jsdoc.json" /Users/tom/code/aspecto/malabi/packages/malabi/src/remote-runner-integration/fetch-remote-tests.ts /Users/tom/code/aspecto/malabi/packages/malabi/src/remote-runner-integration/clear-remote-tests.ts
```