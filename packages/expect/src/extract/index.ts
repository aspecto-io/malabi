import { ReadableSpan } from '@opentelemetry/tracing';
import { SemanticAttributes } from '@opentelemetry/semantic-conventions';

class MalabiExtract {
    private spans: ReadableSpan[];

    constructor(spans: ReadableSpan[]) {
        this.spans = spans;
    }

    all() {
        return this.spans;
    }

    first() {
        if (this.spans.length < 1) throw new Error(`Tried to get the "first" span, but there are no spans.`);
        return this.spans[0];
    }

    second() {
        if (this.spans.length < 2)
            throw new Error(`Tried to get the "second" span, bt there are only ${this.spans.length} spans.`);
        return this.spans[1];
    }

    at(index: number) {
        if (this.spans.length < index + 1)
            throw new Error(`Tried to get the span in ${index} index, but there are only ${this.spans.length} spans.`);
        return this.spans[index];
    }

    http() {
        return new MalabiExtract(this.spans.filter((span) => Boolean(span.attributes[SemanticAttributes.HTTP_METHOD])));
    }

    httpMethod(method: string) {}

    httpGet() {}

    httpPost() {}

    messagingSend() {}

    messagingReceive() {}

    messagingProcess() {}

    sqs() {}

    root() {}

    mongo() {}

    incoming() {}

    outgoing() {}

    typeorm() {}

    sequelize() {}

    neo4j() {}

    database() {}

    messaging() {}

    rpc() {}
}

export type Extract = typeof MalabiExtract;
export const extract = (spans: ReadableSpan[]) => new MalabiExtract(spans);
