import { InstrumentationConfig } from '@opentelemetry/instrumentation';

export enum TestAttributes {
    /** Name of the testing framework executing the test */
    TEST_FRAMEWORK = 'test.framework',

    /** Name of the test itself, without suites */
    TEST_NAME = 'test.name',

    /** Name of the test with the suites */
    TEST_FULL_NAME = 'test.full_name',

    /** Array of suites in which the test reside, in order of nesting (from outer to inner) */
    TEST_SUITES = 'test.suites',

    /** boolean value indicating it the test failed due to timeout */
    TEST_RESULT_TIMEDOUT = 'test.result.timedout',

    /** How many timed to retry failed test */
    TEST_RETRIES = 'test.retries',

    /** the retry attempt to run this test */
    TEST_CURRENT_RETRY = 'test.current_retry',
}

export interface MochaInstrumentationConfig extends InstrumentationConfig {}
