import { ReadableSpan } from '@opentelemetry/tracing';
import { SpanStatusCode } from '@opentelemetry/api';
import { SemanticAttributes } from '@opentelemetry/semantic-conventions';

export class MalabiSpan {
    private span: ReadableSpan;

    constructor(span: ReadableSpan) {
        this.span = span;
    }

    private strAttr(attr: string): string {
        return this.span.attributes[attr] as string;
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

    get name() {
        return this.span.name;
    }

    get kind() {
        return this.span.kind;
    }

    attr(attr: string) {
        return this.span.attributes[attr];
    }

    attribute(attr: string) {
        return this.span.attributes[attr];
    }

    // === Network ===

    get netPeerName() {
        return this.strAttr(SemanticAttributes.NET_PEER_NAME);
    }

    get netTransport() {
        return this.strAttr(SemanticAttributes.NET_TRANSPORT);
    }

    get netPeerPort() {
        return this.attr(SemanticAttributes.NET_PEER_PORT) as number;
    }

    // === HTTP ===

    get httpMethod() {
        return this.strAttr(SemanticAttributes.HTTP_METHOD);
    }

    get httpFullUrl() {
        return this.strAttr(SemanticAttributes.HTTP_URL);
    }

    get httpHost() {
        return this.strAttr(SemanticAttributes.HTTP_HOST);
    }

    get httpRoute() {
        return this.strAttr(SemanticAttributes.HTTP_ROUTE);
    }

    get httpUserAgent() {
        return this.strAttr(SemanticAttributes.HTTP_USER_AGENT);
    }

    get statusCode() {
        const strStatusCode = this.strAttr(SemanticAttributes.HTTP_STATUS_CODE);
        return strStatusCode ? parseInt(strStatusCode) : undefined;
    }

    get requestBody() {
        return this.strAttr('http.request.body');
    }

    get responseBody() {
        return this.strAttr('http.response.body');
    }

    private parseHeaders(attKey: string) {
        const headers = this.strAttr(attKey);
        if (!headers) return null;
        try {
            const parsed = JSON.parse(headers);
            const lowerCaseHeaders = Object.fromEntries(
                Object.entries(parsed).map(([k, v]) => [k.toLowerCase(), v as string])
            );
            return lowerCaseHeaders;
        } catch (err) {
            throw new Error('Headers structure is invalid.');
        }
    }

    get requestHeaders(): Record<string, string> {
        return this.parseHeaders('http.request.headers');
    }

    get responseHeaders(): Record<string, string> {
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
        const url = this.httpFullUrl as string;
        if (!url) return null;

        return Object.fromEntries(new URL(url).searchParams as any);
    }

    queryParam(param: string): string {
        return this.queryParams[param];
    }

    // === DataBase ===

    get dbSystem() {
        return this.strAttr(SemanticAttributes.DB_SYSTEM);
    }

    get dbUser() {
        return this.strAttr(SemanticAttributes.DB_USER);
    }

    get dbName() {
        return this.strAttr(SemanticAttributes.DB_NAME);
    }

    get dbOperation() {
        return this.strAttr(SemanticAttributes.DB_OPERATION);
    }

    get dbStatement() {
        return this.strAttr(SemanticAttributes.DB_STATEMENT);
    }

    get mongoCollection() {
        return this.strAttr(SemanticAttributes.DB_MONGODB_COLLECTION);
    }

    get dbResponse() {
        return this.strAttr('db.response');
    }
    // === Messaging ===

    get messagingSystem() {
        return this.strAttr(SemanticAttributes.MESSAGING_SYSTEM);
    }

    get messagingDestinationKind() {
        return this.strAttr(SemanticAttributes.MESSAGING_DESTINATION_KIND);
    }

    get queueOrTopicName() {
        return this.strAttr(SemanticAttributes.MESSAGING_DESTINATION);
    }

    get queueOrTopicUrl() {
        return this.strAttr(SemanticAttributes.MESSAGING_URL);
    }

    get messagingOperation() {
        return this.strAttr(SemanticAttributes.MESSAGING_OPERATION);
    }

    get messagingPayload() {
        return this.strAttr('messaging.payload');
    }

    // === RPC ===

    get rpcSystem() {
        return this.strAttr(SemanticAttributes.RPC_SYSTEM);
    }

    get rpcService() {
        return this.strAttr(SemanticAttributes.RPC_SERVICE);
    }

    get rpcMethod() {
        return this.strAttr(SemanticAttributes.RPC_METHOD);
    }

    get awsRequestParams() {
        return this.strAttr('aws.request.params');
    }
}
