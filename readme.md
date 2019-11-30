# Scope


![npm package.json version](https://badgen.net/npm/v/hapi-scope?label=version&icon=github)
![GitHub issues](https://badgen.net/github/open-issues/WebMatrixware/hapi-scope?icon=github)
![TravisCI build](https://badgen.net/travis/WebMatrixware/hapi-scope?label=build&icon=travis)
![CodeCov Coverage](https://badgen.net/codecov/c/github/WebMatrixware/hapi-scope?icon=codecov)

Scope is designed to be a lightweight utility to publish basic route information to the console upon starting a [hapi](https://hapi.dev/) server instance.

Scope is intended for hapi 17.0 and up and currently tested on hapi 18.4.0.

Scope is inspired by [blipp](https://github.com/danielb2/blipp), it mostly differs in added simplicity of the codebase and a few features that I wanted and decided would be easier to just write than add to blipp.

Scope uses [columnify](https://github.com/timoxley/columnify) on the back end to line up the data, handle lines that are too long, and support wrapping long fields.

### Installation
``` 
npm install hapi-scope
```

### Sample Usage
```
'use strict';

const Hapi = require('@hapi/hapi');

const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

	await server.register([{
    	plugin: require('hapi-scope'),
        options: {}
    }]);
    
    await server.start();
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();
```

### Options
Passing an empty object to Scope on initialization will cause it to use it's defaults. You can also set some or all of them manually when initializing Scope. These are all booloean (true|false) flags to either show or hide the specified aspect of a routes configuration.

|Option|Default|Description|
|------|-------|-----------|
|auth |false |Show the name of the authentication strategy for the route|
|description |true |Show the optional description of the route|
|handler |false |Show the name of the handler function for the route (Assumes a named function, which you should be using anyway)|
|method |true |Show the HTTP method the route responds on|
|path | true |Show the HTTP path for the route|
|tags | true |Show the optional tags associated with the route|