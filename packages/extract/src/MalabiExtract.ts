import { ReadableSpan } from '@opentelemetry/tracing';
import { SpanKind } from '@opentelemetry/api';
import { SemanticAttributes, MessagingOperationValues } from '@opentelemetry/semantic-conventions';
import { MalabiSpan } from './MalabiSpan';

class MalabiExtract {
    private spans: ReadableSpan[];

    constructor(spans: ReadableSpan[]) {
        this.spans = spans;
    }

    private filter(predicate: (span: ReadableSpan) => boolean): MalabiExtract {
        return new MalabiExtract(this.spans.filter(predicate));
    }

    get raw() {
        return this.spans;
    }

    get length() {
        return this.spans.length;
    }

    get first() {
        if (this.spans.length < 1) throw new Error(`Tried to get the "first" span, but there are no spans.`);
        return new MalabiSpan(this.spans[0]);
    }

    get second() {
        if (this.spans.length < 2)
            throw new Error(`Tried to get the "second" span, bt there are only ${this.spans.length} spans.`);
        return new MalabiSpan(this.spans[1]);
    }

    get all(): MalabiSpan[] {
        return this.spans.map(s => new MalabiSpan(s));
    }

    at(index: number) {
        if (this.spans.length < index + 1)
            throw new Error(`Tried to get the span in ${index} index, but there are only ${this.spans.length} spans.`);
        return new MalabiSpan(this.spans[index]);
    }

    http() {
        return this.filter((span) => Boolean(span.attributes[SemanticAttributes.HTTP_METHOD]));
    }

    httpMethod(method: string) {
        return this.filter(
            (span) =>
                (span.attributes[SemanticAttributes.HTTP_METHOD] as string)?.toLowerCase() === method.toLowerCase()
        );
    }

    httpGet() {
        return this.filter(
            (span) => (span.attributes[SemanticAttributes.HTTP_METHOD] as string)?.toLowerCase() === 'get'
        );
    }

    httpPost() {
        return this.filter(
            (span) => (span.attributes[SemanticAttributes.HTTP_METHOD] as string)?.toLowerCase() === 'post'
        );
    }

    route(r: string | RegExp) {
        return this.filter((span) => {
            const route = span[SemanticAttributes.HTTP_ROUTE] as string;
            return typeof r === 'string' ? route?.toLowerCase() === r.toLowerCase() : r.test(route);
        });
    }

    path(p: string | RegExp) {
        return this.filter((span) => {
            const path = span.attributes['http.path'] as string;
            return typeof p === 'string' ? path?.toLowerCase() === p.toLowerCase() : p.test(path);
        });
    }

    messagingSend() {
        return this.filter((span) => span.kind === SpanKind.PRODUCER);
    }

    messagingReceive() {
        return this.filter(
            (span) => span.attributes[SemanticAttributes.MESSAGING_OPERATION] === MessagingOperationValues.RECEIVE
        );
    }

    messagingProcess() {
        return this.filter(
            (span) => span.attributes[SemanticAttributes.MESSAGING_OPERATION] === MessagingOperationValues.PROCESS
        );
    }

    awsSqs() {
        return this.filter((span) => span.attributes[SemanticAttributes.RPC_SERVICE] === 'sqs');
    }

    entry() {
        return this.filter((span) => !span.parentSpanId);
    }

    mongo() {
        return this.filter((span) => span.attributes[SemanticAttributes.DB_SYSTEM] === 'mongodb');
    }

    incoming() {
        return this.filter((span) => span.kind === SpanKind.CLIENT);
    }

    outgoing() {
        return this.filter((span) => span.kind === SpanKind.SERVER);
    }

    typeorm() {
        return this.filter((span) => span.instrumentationLibrary.name.includes('typeorm'));
    }

    sequelize() {
        return this.filter((span) => span.instrumentationLibrary.name.includes('sequelize'));
    }

    neo4j() {
        return this.filter((span) => span.instrumentationLibrary.name.includes('neo4j'));
    }

    database() {
        return this.filter((span) => Boolean(span.attributes[SemanticAttributes.DB_SYSTEM]));
    }

    dbOperation(op: string) {
        return this.filter(
            (span) => (span.attributes[SemanticAttributes.DB_OPERATION] as string)?.toLowerCase() === op.toLowerCase()
        );
    }

    messaging() {
        return this.filter((span) => Boolean(span.attributes[SemanticAttributes.MESSAGING_SYSTEM]));
    }

    rpc() {
        return this.filter((span) => Boolean(span.attributes[SemanticAttributes.RPC_SYSTEM]));
    }

    aws() {
        return this.filter((span) => span.attributes[SemanticAttributes.RPC_SYSTEM] === 'aws-api');
    }
}

export type Extract = typeof MalabiExtract;
export const extract = (spans: ReadableSpan[]) => new MalabiExtract(spans);
