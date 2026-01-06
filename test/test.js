'use strict';

const Code = require('@hapi/code');
const Hapi = require('@hapi/hapi');
const Lab = require('@hapi/lab');
const stdout = require('test-console').stdout;

const { expect } = Code;
const { describe, it } = exports.lab  = Lab.script();

let Server = null;

const requestOptions = {
    auth: {
        strategy: 'simple',
        credentials: {
            uersname: 'test',
            password: 'test'
        }
    },
    method: 'GET',
    url: '/'
};

const deploy = async function deployment(opts) {

    const validate = function validate(request, username, password) {

        return true;
    };

    const handler = function handler(request, h) {

        return h.response('passed').code(200);
    };

    Server = Hapi.server({
        host: '0.0.0.0',
        port: '80'
    });

    await Server.register(require('@hapi/basic'));

    Server.auth.strategy('simple', 'basic', { validate });

    Server.route([{
        method: 'GET',
        path: '/users/{id}',
        handler,
        options: {
            description: 'Test multi-segment path',
            tags: ['test', 'multi-segment']
        }
    }, {
        method: 'GET',
        path: '/accounts/{accountid}',
        handler,
        options: {
            description: 'Another test multi-segment path',
            tags: ['test', 'multi-segment']
        }
    }, {
        method: 'GET',
        path: '/',
        handler,
        options: {
            auth: 'simple',
            description: 'Test base path',
            tags: ['test', 'base']
        }
    }, {
        method: 'GET',
        path: '/{id}',
        handler,
        options: {
            description: 'Test params path',
            tags: ['test', 'params']
        }
    }]);

    await Server.register([{
        plugin: require('../index.js'),
        options: opts
    }]);

    return Server;
};

const teardown = async function teardown() {

    await Server.stop();
};

describe('Scope package feature tests, it', () => {

    it('should start and display with default settings', { plan: 1 }, async () => {

        const s = await deploy({});
        const resp = await s.inject(requestOptions);
        expect(resp.statusCode).to.equal(200);
        await teardown();
    });

    it('should start and run with all settings turned on', { plan: 1 }, async () => {

        const s = await deploy({ method: true, path: true, auth: true, tags: true, description: true, handler: true });
        const resp = await s.inject(requestOptions);
        expect(resp.statusCode).to.equal(200);
        await teardown();
    });

    it('should start and run with just method and path turned on', { plan: 1 }, async () => {

        const s = await deploy({ method: true, path: true, auth: false, tags: false, description: false, handler: false });
        const resp = await s.inject(requestOptions);
        expect(resp.statusCode).to.equal(200);
        await teardown();
    });

    it('should start and run with method turned off', { plan: 1 }, async () => {

        const s = await deploy({ method: false, path: true, auth: false, tags: false, description: false, handler: false });
        const resp = await s.inject(requestOptions);
        expect(resp.statusCode).to.equal(200);
        await teardown();
    });

    it('should start and run with path turned off', { plan: 1 }, async () => {

        const s = await deploy({ method: true, path: false, auth: false, tags: false, description: false, handler: false });
        const resp = await s.inject(requestOptions);
        expect(resp.statusCode).to.equal(200);
        await teardown();
    });

    it('should sort routes by their paths', { plan: 2 }, async () => {

        const inspect = stdout.inspect();
        const s = await deploy();
        const resp = await s.inject(requestOptions);
        inspect.restore();
        expect(inspect.output[2]).to.match(/.*PATH.*\n.*\/.*\n.*\/.*\{id\}.*\n.*\/accounts\/.*\{accountid\}.*\n.*\/users\/.*\{id\}.*/g);
        expect(resp.statusCode).to.equal(200);
        await teardown();
    });
});
