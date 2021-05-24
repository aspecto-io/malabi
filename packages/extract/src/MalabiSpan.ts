import { ReadableSpan } from '@opentelemetry/tracing';
import { SpanStatusCode } from '@opentelemetry/api';
import { SemanticAttributes } from '@opentelemetry/semantic-conventions';

export class MalabiSpan {
    private span: ReadableSpan;

    constructor(span: ReadableSpan) {
        this.span = span;
    }

    // === Misc ===

    get raw() {
        return this.span;
    }

    get hasError() {
        return this.span.status.code === SpanStatusCode.ERROR;
    }

    get errorMessage() {
        return this.span.status.message;
    }

    // === HTTP ===

    get httpMethod() {
        return this.span.attributes[SemanticAttributes.HTTP_METHOD];
    }

    get httpFullUrl() {
        return this.span.attributes[SemanticAttributes.HTTP_URL];
    }

    get httpHost() {
        return this.span.attributes[SemanticAttributes.HTTP_HOST];
    }

    get httpRoute() {
        return this.span.attributes[SemanticAttributes.HTTP_ROUTE];
    }

    get httpUserAgent() {
        return this.span.attributes[SemanticAttributes.HTTP_USER_AGENT];
    }

    get statusCode() {
        const strStatusCode = this.span.attributes[SemanticAttributes.HTTP_STATUS_CODE];
        return strStatusCode ? parseInt(strStatusCode as string) : undefined;
    }

    get requestBody() {
        return this.span.attributes['http.request.body'];
    }

    get responseBody() {
        return this.span.attributes['http.response.body'];
    }

    private parseHeaders(attKey: string) {
        const headers = this.span.attributes[attKey] as string;
        if (!headers) return null;
        const parsed = JSON.parse(headers);
        const lowerCaseHeaders = Object.fromEntries(Object.entries(parsed).map(([k, v]) => [k.toLowerCase(), v]));

        return lowerCaseHeaders;
    }

    get requestHeaders() {
        return this.parseHeaders('http.request.headers');
    }

    get responseHeaders() {
        return this.parseHeaders('http.response.headers');
    }

    requestHeader(header: string) {
        const headers = this.requestHeaders;
        return headers ? headers[header.toLowerCase()] : null;
    }

    responseHeader(header: string) {
        const headers = this.responseHeaders;
        return headers ? headers[header.toLowerCase()] : null;
    }

    get queryParams() {
        const qs = ((this.httpFullUrl as string) ?? '').split('?')[1];
        if (typeof qs !== 'string') return {};
        return Object.fromEntries(new URLSearchParams(qs) as any);
    }

    queryParam(param: string) {
        return this.queryParams[param];
    }

    // === DataBase ===

    get dbSystem() {
        return this.span.attributes[SemanticAttributes.DB_SYSTEM];
    }

    get dbUser() {
        return this.span.attributes[SemanticAttributes.DB_USER];
    }

    get dbName() {
        return this.span.attributes[SemanticAttributes.DB_NAME];
    }

    get dbOperation() {
        return this.span.attributes[SemanticAttributes.DB_OPERATION];
    }

    get dbStatement() {
        return this.span.attributes[SemanticAttributes.DB_STATEMENT];
    }

    get mongoCollection() {
        return this.span.attributes[SemanticAttributes.DB_MONGODB_COLLECTION];
    }

    get dbResponse() {
        return this.span.attributes['db.response'];
    }        

    // === Messaging ===

    get messagingSystem() {
        return this.span.attributes[SemanticAttributes.MESSAGING_SYSTEM];
    }

    get messagingDestinationKind() {
        return this.span.attributes[SemanticAttributes.MESSAGING_DESTINATION_KIND];
    }

    get queueOrTopicName() {
        return this.span.attributes[SemanticAttributes.MESSAGING_DESTINATION];
    }

    get queueOrTopicUrl() {
        return this.span.attributes[SemanticAttributes.MESSAGING_URL];
    }

    get messagingOperation() {
        return this.span.attributes[SemanticAttributes.MESSAGING_OPERATION];
    }

    get messagingPayload() {
        return this.span.attributes['messaging.payload'];
    }

    // === RPC ===

    get rpcSystem() {
        return this.span.attributes[SemanticAttributes.RPC_SYSTEM];
    }

    get rpcService() {
        return this.span.attributes[SemanticAttributes.RPC_SERVICE];
    }

    get rpcMethod() {
        return this.span.attributes[SemanticAttributes.RPC_METHOD];
    }

    get awsRequestParams() {
        return this.span.attributes['aws.request.params'];
    }
}
