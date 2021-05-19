import { context, setSpan }  from '@opentelemetry/api';
import type { Runnable } from 'mocha';
import { endSpan, startSpan } from './instrumentation';

export const mochaHooks = {

    beforeEach(done) {
        const test = this.currentTest as Runnable;
        const spanForTest = startSpan(test);
        context.with(setSpan(context.active(), spanForTest), done);
    },

    afterEach(done) {
        const test = this.currentTest as Runnable;
        endSpan(test, (test as any).err);
        done();
    }
}