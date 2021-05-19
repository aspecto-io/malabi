import 'mocha';
import expect from 'expect';
import type { InMemorySpanExporter } from '@opentelemetry/tracing';
const memoryExporter: InMemorySpanExporter = require('./instrument');
import { TestAttributes } from '../src/types';
import { SpanKind, SpanStatusCode, trace } from '@opentelemetry/api';

describe('mocha', () => {

    describe('empty test', () => {

        before(() => {
            memoryExporter.reset();
        });

        it('successful test', () => {
            // this test just validate that a span is created
        });

        it('validate successful test', () => {
            expect(memoryExporter.getFinishedSpans().length).toBe(1);
            const [testSpan] = memoryExporter.getFinishedSpans();

            // name
            expect(testSpan.name).toMatch('successful test');

            // attributes
            expect(testSpan.attributes[TestAttributes.TEST_NAME]).toMatch('successful test');
            expect(testSpan.attributes[TestAttributes.TEST_FULL_NAME]).toMatch('successful test');
            expect(testSpan.attributes[TestAttributes.TEST_SUITES]).toStrictEqual(['mocha', 'empty test']);
            expect(testSpan.attributes[TestAttributes.TEST_RESULT_TIMEDOUT]).toBe(false);
            expect(testSpan.attributes[TestAttributes.TEST_RETRIES]).toBeUndefined();

            // status
            expect(testSpan.status.code).toBe(SpanStatusCode.UNSET);
            expect(testSpan.status.message).toBeUndefined();

            // kind
            expect(testSpan.kind).toBe(SpanKind.CLIENT);
        });
    });

    describe('retried test', function() {

        this.retries(2);
        let retryCount = 0;

        before(() => {
            memoryExporter.reset();
        });

        it('retry test', () => {

            // fail just the first retry so it won't fail the entire run
            if(retryCount === 0) {
                retryCount++;
                expect(true).toBeFalsy();
            }
        });

        it('validate retry test', () => {
            if(retryCount !== 1) {
                return;
            }
            expect(memoryExporter.getFinishedSpans().length).toBe(2);
            const [firstRun, retry] = memoryExporter.getFinishedSpans();

            expect(firstRun.attributes[TestAttributes.TEST_RETRIES]).toBe(2);
            expect(firstRun.attributes[TestAttributes.TEST_CURRENT_RETRY]).toBe(0);
            expect(firstRun.status.code).toBe(SpanStatusCode.ERROR);
            expect(firstRun.status.message).not.toBeUndefined();

            expect(retry.attributes[TestAttributes.TEST_RETRIES]).toBe(2);
            expect(retry.attributes[TestAttributes.TEST_CURRENT_RETRY]).toBe(1);
            expect(retry.status.code).toBe(SpanStatusCode.UNSET);
            expect(retry.status.message).toBeUndefined();
        });
    });

    describe('span created in test', () => {
       
        before(() => {
            memoryExporter.reset();
        });

        it('test with span', () => {
            const tracer = trace.getTracer('tracer for unittest');
            tracer.startSpan('internal span in test').end();
        });

        it('validate test with span', () => {
            expect(memoryExporter.getFinishedSpans().length).toBe(2);
            const [internalSpan, testSpan] = memoryExporter.getFinishedSpans();

            // make sure that internal span is the child of test span
            expect(internalSpan.parentSpanId).toEqual(testSpan.spanContext.spanId);
        });
    });
});
