
import { trace, Span, SpanStatusCode, SpanKind }  from '@opentelemetry/api';
import type { Runnable, Suite } from 'mocha';
import { TestAttributes } from './types';
import { VERSION } from './version';

export const TEST_SPAN_KEY = Symbol.for('opentelemetry.mocha.span_key');

type TestWithSpan = { 
    [TEST_SPAN_KEY]?: Span,
} & Runnable;

const getSuitesRecursive = (suite: Suite): string[] => {
    if(!suite) {
        return [];
    }

    const parentSuites = getSuitesRecursive(suite.parent);
    return suite.title ? [...parentSuites, suite.title] : parentSuites;
}

export const startSpan = (test: TestWithSpan): Span => {

    const existingSpan = getTestSpan(test);
    if(existingSpan) {
        return existingSpan;
    }

    const tracer = trace.getTracer('opentelemetry-instrumentation-mocha', VERSION);

    const attributes = {
        [TestAttributes.TEST_NAME]: test.title,
        [TestAttributes.TEST_FULL_NAME]: test.fullTitle(),
        [TestAttributes.TEST_SUITES]: getSuitesRecursive(test.parent),
    };

    const retries = (test as any).retries();
    if(retries >= 0) {
        attributes[TestAttributes.TEST_RETRIES] = retries;

        const currentRetry = (test as any).currentRetry();
        if(currentRetry != null) {
            attributes[TestAttributes.TEST_CURRENT_RETRY] = currentRetry;
        }
    }

    const spanForTest = tracer.startSpan(test.fullTitle(), {
        attributes,
        root: true,
        kind: SpanKind.CLIENT,
    });
    Object.defineProperty(test, TEST_SPAN_KEY, {
        value: spanForTest,
        enumerable: false,
        // configurable: false,
    });

    return spanForTest;
}

export const endSpan = (test: TestWithSpan, err: any) => {

    const spanForTest: Span = getTestSpan(test);
    if(!spanForTest) {
        return;
    }

    if(!spanForTest.isRecording()) {
        return;
    }

    if(err) {
        spanForTest.setStatus({
            code: SpanStatusCode.ERROR,
            message: err.message,
        });
    }

    spanForTest.setAttribute(TestAttributes.TEST_RESULT_TIMEDOUT, test.timedOut);
    spanForTest.end();
}

export const getTestSpan = (test: TestWithSpan): Span => {
    return test[TEST_SPAN_KEY];
}
