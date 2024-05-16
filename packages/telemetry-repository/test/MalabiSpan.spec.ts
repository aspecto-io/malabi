import 'mocha';
import { MalabiSpan } from '../src/MalabiSpan';
import { ReadableSpan } from '@opentelemetry/sdk-trace-base';
import { SpanKind, SpanStatusCode } from '@opentelemetry/api';
import expect from 'expect';

describe('MalabiSpan', () => {
    const span: ReadableSpan = {
        attributes: {
            'messaging.system': 'aws.sqs',
            'messaging.destination_kind': 'queue',
            'messaging.destination': 'my-queue',
            'messaging.url': 'http://localstack:4566/000000000000/my-queue',
            'messaging.payload': '{"title":"Playground","pageId":43579833}',
            'messaging.operation': 'process',
            'http.url': 'http://localhost:8000/auth/profile?token=1234',
            'http.host': 'localhost:8000',
            'http.method': 'GET',
            'http.route': '/auth/profile',
            'http.user_agent': 'Chrome',
            'http.status_code': 401,
            'span.kind': 'internal',
            'http.request.headers': '{"Host":"localhost:8000","coNNecTion":"Keep-Alive"}',
            'http.request.body': 'hello',
            'http.response.headers': '{"x-powered-by":"Express","Access-Control-Allow-Origin":"*"}',
            'http.response.body': '{"_id":"60643994b0e6810024914e60","username":"homer","firstName":"Homer","lastName":"Simpson","email":"doh@gmail.com"}',
            'db.name': 'my-db',
            'db.user': 'shlomo',
            'db.system': 'mongodb',
            'db.operation': 'createIndexes',
            'db.mongodb.collection': 'my-collection',
            'db.statement': 'some-statement',
            'db.response': 'some-response',
            'rpc.system': 'aws-api',
            'rpc.service': 's3',
            'rpc.method': 'putObject',
            'aws.request.params': 'some-aws-req-params',
            'some-attr': 'david',
        },
        duration: [123, 123],
        endTime: [123, 123],
        ended: true,
        events: [],
        instrumentationLibrary: {
            name: 'test',
        },
        kind: SpanKind.CLIENT,
        links: [],
        name: 'name',
        resource: null,
        startTime: [123, 123],
        status: {
            code: SpanStatusCode.ERROR,
            message: 'Some Error Message!',
        },
        spanContext: null,
        droppedAttributesCount: 0,
        droppedEventsCount: 0,
        droppedLinksCount: 0
    };

    const malabiSpan = new MalabiSpan(span);

    it('raw', () => {
        expect(malabiSpan.raw).toBe(span);
    });

    it('hasError', () => {
        expect(malabiSpan.hasError).toBe(true);
    });

    it('errorMessage', () => {
        expect(malabiSpan.errorMessage).toBe('Some Error Message!');
    });

    it('attr', () => {
        expect(malabiSpan.attr('some-attr')).toBe('david');
    });

    it('attribute', () => {
        expect(malabiSpan.attribute('some-attr')).toBe('david');
    });

    it('httpMethod', () => {
        expect(malabiSpan.httpMethod).toBe('GET');
    });

    it('httpFullUrl', () => {
        expect(malabiSpan.httpFullUrl).toBe('http://localhost:8000/auth/profile?token=1234');
    });

    it('httpHost', () => {
        expect(malabiSpan.httpHost).toBe('localhost:8000');
    });

    it('httpRoute', () => {
        expect(malabiSpan.httpRoute).toBe('/auth/profile');
    });

    it('httpUserAgent', () => {
        expect(malabiSpan.httpUserAgent).toBe('Chrome');
    });

    it('statusCode', () => {
        expect(malabiSpan.statusCode).toBe(401);
    });

    it('requestBody', () => {
        expect(malabiSpan.requestBody).toBe('hello');
    });

    it('responseBody', () => {
        expect(malabiSpan.responseBody).toBe(span.attributes['http.response.body']);
    });

    it('requestHeaders - parses and changes keys to lower case', () => {
        expect(malabiSpan.requestHeaders).toEqual({ connection: 'Keep-Alive', host: 'localhost:8000' });
    });

    it('responseHeaders - parses and changes keys to lower case', () => {
        expect(malabiSpan.responseHeaders).toEqual({ 'access-control-allow-origin': '*', 'x-powered-by': 'Express' });
    });

    it('requestHeader - case agnostic', () => {
        expect(malabiSpan.requestHeader('Connection')).toBe('Keep-Alive');
        expect(malabiSpan.requestHeader('connection')).toBe('Keep-Alive');
        expect(malabiSpan.requestHeader('coNneCtioN')).toBe('Keep-Alive');
        expect(malabiSpan.requestHeader('not-there')).toBe(undefined);
    });

    it('responseHeader - case agnostic', () => {
        expect(malabiSpan.responseHeader('x-powered-by')).toBe('Express');
        expect(malabiSpan.responseHeader('X-Powered-By')).toBe('Express');
        expect(malabiSpan.responseHeader('X-POWERED-BY')).toBe('Express');
        expect(malabiSpan.responseHeader('not-there')).toBe(undefined);
    });

    it('queryParams - parses', () => {
        expect(malabiSpan.queryParams).toEqual({ token: '1234' });
    });

    it('queryParam', () => {
        expect(malabiSpan.queryParam('token')).toBe('1234');
        expect(malabiSpan.queryParam('other')).toBe(undefined);
    });

    it('dbSystem', () => {
        expect(malabiSpan.dbSystem).toBe('mongodb');
    });

    it('dbUser', () => {
        expect(malabiSpan.dbUser).toBe('shlomo');
    });

    it('dbName', () => {
        expect(malabiSpan.dbName).toBe('my-db');
    });

    it('dbOperation', () => {
        expect(malabiSpan.dbOperation).toBe('createIndexes');
    });

    it('dbStatement', () => {
        expect(malabiSpan.dbStatement).toBe('some-statement');
    });

    it('mongoCollection', () => {
        expect(malabiSpan.mongoCollection).toBe('my-collection');
    });

    it('dbResponse', () => {
        expect(malabiSpan.dbResponse).toBe('some-response');
    });

    it('messagingSystem', () => {
        expect(malabiSpan.messagingSystem).toBe('aws.sqs');
    });

    it('messagingDestinationKind', () => {
        expect(malabiSpan.messagingDestinationKind).toBe('queue');
    });

    it('queueOrTopicName', () => {
        expect(malabiSpan.queueOrTopicName).toBe('my-queue');
    });

    it('queueOrTopicUrl', () => {
        expect(malabiSpan.queueOrTopicUrl).toBe('http://localstack:4566/000000000000/my-queue');
    });

    it('messagingOperation', () => {
        expect(malabiSpan.messagingOperation).toBe('process');
    });

    it('messagingPayload', () => {
        expect(malabiSpan.messagingPayload).toBe('{"title":"Playground","pageId":43579833}');
    });

    it('rpcSystem', () => {
        expect(malabiSpan.rpcSystem).toBe('aws-api');
    });

    it('rpcService', () => {
        expect(malabiSpan.rpcService).toBe('s3');
    });

    it('rpcMethod', () => {
        expect(malabiSpan.rpcMethod).toBe('putObject');
    });

    it('awsRequestParams', () => {
        expect(malabiSpan.awsRequestParams).toBe('some-aws-req-params');
    });
});
