
export enum GeneralExtendedAttribute {
    INSTRUMENTED_LIBRARY_VERSION = 'instrumented_library.version',
}

export enum MessagingExtendedAttribute {
    MESSAGING_PAYLOAD = 'messaging.payload',
    MESSAGING_RABBITMQ_CONSUME_END_OPERATION = 'messaging.rabbitmq.consume_end_operation',
}

export enum DbExtendedAttribute {
    DB_RESPONSE = 'db.response',
}

export enum HttpExtendedAttribute {
    HTTP_REQUEST_HEADERS = 'http.request.headers',
    HTTP_REQUEST_BODY = 'http.request.body',
    HTTP_RESPONSE_HEADERS = 'http.response.headers',
    HTTP_RESPONSE_BODY = 'http.response.body',
    HTTP_PATH = 'http.path',
}