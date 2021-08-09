import { ReadableSpan } from '@opentelemetry/tracing';
import SpansRepository from './SpansRepository';

/**
 * A Class that allows access of telemetry from the test run. for example: HTTP GET spans. Mongo db spans, etc.
 *
 * Read more about OpenTelemetry [here]{@link https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/trace/api.md}
 */
export class TelemetryRepository {
    private readonly spansRepository: SpansRepository;

    /**
     * Fetches the spans from the exposed malabi spans endpoint
     * @param spans An array of ReadableSpans
     */
    constructor(spans: ReadableSpan[]) {
        this.spansRepository = new SpansRepository(spans);
    }

    /**
     * Get the SpansRepository object that allows you to do filtering on the spans. chaining is filters supported.
     */
    get spans() {
        return this.spansRepository;
    }
}

export const initRepository = (spans: ReadableSpan[]) => new TelemetryRepository(spans);