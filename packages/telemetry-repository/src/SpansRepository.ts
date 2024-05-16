import { ReadableSpan } from '@opentelemetry/sdk-trace-base';
import { MalabiSpan } from './MalabiSpan';
import { MessagingOperationValues, SemanticAttributes } from '@opentelemetry/semantic-conventions';
import { SpanKind } from '@opentelemetry/api';

/**
 * A Class that allows access of spans created in the test run. for example: HTTP GET spans. Mongo db spans, etc.
 * Read more about OpenTelemetry Spans [here]{@link https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/trace/api.md#span}
 */
class SpansRepository {
    readonly spans: ReadableSpan[];

    /**
     * Initializes the internal spans array.
     * @param spans An array of ReadableSpans
     */
    constructor(spans: ReadableSpan[]) {
        this.spans = spans;
    }

    /**
     * Filters the internal spans array according to the predicate.
     * Returns a new SpansRepository object to allow chaining.
     * @param predicate A predicate to filter the spans.
     */
    private filter(predicate: (span: ReadableSpan) => boolean): SpansRepository {
        return new SpansRepository(this.spans.filter(predicate));
    }

    /**
     * Returns how many spans are currently in the array.
     */
    get length() {
        return this.spans.length;
    }

    /**
     * Returns the first span as MalabiSpan.
     */
    get first() {
        if (this.spans.length < 1) throw new Error(`Tried to get the "first" span, but there are no spans.`);
        return new MalabiSpan(this.spans[0]);
    }

    /**
     * Returns the second span as MalabiSpan.
     */
    get second() {
        if (this.spans.length < 2)
            throw new Error(`Tried to get the "second" span, but there are only ${this.spans.length} spans.`);
        return new MalabiSpan(this.spans[1]);
    }

    /**
     * Returns all spans as MalabiSpan.
     */
    get all(): MalabiSpan[] {
        return this.spans.map((s) => new MalabiSpan(s));
    }

    /**
     * Returns span at the given index as MalabiSpan.
     * @param index The index to retrieve.
     */
    at(index: number) {
        if (this.spans.length < index + 1)
            throw new Error(`Tried to get the span in ${index} index, but there are only ${this.spans.length} spans.`);
        return new MalabiSpan(this.spans[index]);
    }

    /**
     * Returns a new instance of SpansRepository with only HTTP spans.
     */
    http() {
        return this.filter((span) => Boolean(span.attributes[SemanticAttributes.HTTP_METHOD]));
    }

    /**
     * Returns a new instance of SpansRepository with only HTTP spans, filtered by method.
     * @param The method to filter by. GET,POST, etc.
     */
    httpMethod(method: string) {
        return this.filter(
            (span) =>
                (span.attributes[SemanticAttributes.HTTP_METHOD] as string)?.toLowerCase() === method.toLowerCase()
        );
    }


    /**
     * Returns a new instance of SpansRepository with only HTTP GET spans.
     */
    httpGet() {
        return this.filter(
            (span) => (span.attributes[SemanticAttributes.HTTP_METHOD] as string)?.toLowerCase() === 'get'
        );
    }

    /**
     * Returns a new instance of SpansRepository with only HTTP POST spans.
     */
    httpPost() {
        return this.filter(
            (span) => (span.attributes[SemanticAttributes.HTTP_METHOD] as string)?.toLowerCase() === 'post'
        );
    }

    /**
     * Returns a new instance of SpansRepository with only HTTP spans that have a specific route
     * @param r The route to filter by.
     */
    route(r: string | RegExp) {
        return this.filter((span) => {
            const route = span[SemanticAttributes.HTTP_ROUTE] as string;
            return typeof r === 'string' ? route?.toLowerCase() === r.toLowerCase() : r.test(route);
        });
    }

    /**
     * Returns a new instance of SpansRepository with only HTTP spans that have a specific path
     * @param p The path to filter by.
     */
    path(p: string | RegExp) {
        return this.filter((span) => {
            const path = span.attributes['http.path'] as string;
            return typeof p === 'string' ? path?.toLowerCase() === p.toLowerCase() : p.test(path);
        });
    }

    /**
     * Returns a new instance of SpansRepository with only messaging spans with the following kind: producer.
     */
    messagingSend() {
        return this.filter((span) => span.kind === SpanKind.PRODUCER);
    }

    /**
     * Returns a new instance of SpansRepository with only messaging spans with the following MESSAGING_OPERATION: receive.
     */
    messagingReceive() {
        return this.filter(
            (span) => span.attributes[SemanticAttributes.MESSAGING_OPERATION] === MessagingOperationValues.RECEIVE
        );
    }

    /**
     * Returns a new instance of SpansRepository with only messaging spans with the following MESSAGING_OPERATION: process.
     */
    messagingProcess() {
        return this.filter(
            (span) => span.attributes[SemanticAttributes.MESSAGING_OPERATION] === MessagingOperationValues.PROCESS
        );
    }


    /**
     * Returns a new instance of SpansRepository with SQS spans only.
     */
    awsSqs() {
        return this.filter((span) => span.attributes[SemanticAttributes.RPC_SERVICE] === 'sqs');
    }

    /**
     * Returns a new instance of SpansRepository with the entry span only (meaning without parent span id).
     */
    entry() {
        return this.filter((span) => !span.parentSpanId);
    }

    /**
     * Returns a new instance of SpansRepository mongo db spans only.
     */
    mongo() {
        return this.filter((span) => span.attributes[SemanticAttributes.DB_SYSTEM] === 'mongodb');
    }

    /**
     * Returns a new instance of SpansRepository with incoming spans only.
     */
    incoming() {
        return this.filter((span) => span.kind === SpanKind.SERVER);
    }

    /**
     * Returns a new instance of SpansRepository with outgoing spans only.
     */
    outgoing() {
        return this.filter((span) => span.kind === SpanKind.CLIENT);
    }

    /**
     * Returns a new instance of SpansRepository with express spans only.
     */
    express() {
        return this.filter((span) => span.instrumentationLibrary.name.includes('express'));
    }

    /**
     * Returns a new instance of SpansRepository with TypeORM spans only.
     */
    typeorm() {
        return this.filter((span) => span.instrumentationLibrary.name.includes('typeorm'));
    }

    /**
     * Returns a new instance of SpansRepository with sequelize spans only.
     */
    sequelize() {
        return this.filter((span) => span.instrumentationLibrary.name.includes('sequelize'));
    }

    /**
     * Returns a new instance of SpansRepository with Neo4j spans only.
     */
    neo4j() {
        return this.filter((span) => span.instrumentationLibrary.name.includes('neo4j'));
    }

    /**
     * Returns a new instance of SpansRepository with database spans only.
     */
    database() {
        return this.filter((span) => Boolean(span.attributes[SemanticAttributes.DB_SYSTEM]));
    }

    /**
     * Returns a new instance of SpansRepository with database spans that match a given operation.
     * @param op The operation to filter by. For example: "save".
     */
    dbOperation(op: string) {
        return this.filter(
            (span) => (span.attributes[SemanticAttributes.DB_OPERATION] as string)?.toLowerCase() === op.toLowerCase()
        );
    }

    /**
     * Returns a new instance of SpansRepository with messaging spans only.
     */
    messaging() {
        return this.filter((span) => Boolean(span.attributes[SemanticAttributes.MESSAGING_SYSTEM]));
    }

    /**
     * Returns a new instance of SpansRepository with rpc spans only.
     */
    rpc() {
        return this.filter((span) => Boolean(span.attributes[SemanticAttributes.RPC_SYSTEM]));
    }

     /**
     * Returns a new instance of SpansRepository with Redis spans only.
     */
    redis (){
        return this.filter((span) => span.attributes[SemanticAttributes.DB_SYSTEM] === 'redis');
    }

    /**
     * Returns a new instance of SpansRepository with AWS spans only.
     */
    aws() {
        return this.filter((span) => span.attributes[SemanticAttributes.RPC_SYSTEM] === 'aws-api');
    }
}

export default SpansRepository;
