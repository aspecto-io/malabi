/* eslint-disable */
import Long from 'long';
import _m0 from 'protobufjs/minimal';
import { Resource } from '../../../../opentelemetry/proto/resource/v1/resource';
import { InstrumentationLibrary, KeyValue } from '../../../../opentelemetry/proto/common/v1/common';

export const protobufPackage = 'opentelemetry.proto.trace.v1';

/** A collection of InstrumentationLibrarySpans from a Resource. */
export interface ResourceSpans {
    /**
     * The resource for the spans in this message.
     * If this field is not set then no resource info is known.
     */
    resource: Resource | undefined;
    /** A list of InstrumentationLibrarySpans that originate from a resource. */
    instrumentationLibrarySpans: InstrumentationLibrarySpans[];
}

/** A collection of Spans produced by an InstrumentationLibrary. */
export interface InstrumentationLibrarySpans {
    /**
     * The instrumentation library information for the spans in this message.
     * Semantically when InstrumentationLibrary isn't set, it is equivalent with
     * an empty instrumentation library name (unknown).
     */
    instrumentationLibrary: InstrumentationLibrary | undefined;
    /** A list of Spans that originate from an instrumentation library. */
    spans: Span[];
}

/**
 * Span represents a single operation within a trace. Spans can be
 * nested to form a trace tree. Spans may also be linked to other spans
 * from the same or different trace and form graphs. Often, a trace
 * contains a root span that describes the end-to-end latency, and one
 * or more subspans for its sub-operations. A trace can also contain
 * multiple root spans, or none at all. Spans do not need to be
 * contiguous - there may be gaps or overlaps between spans in a trace.
 *
 * The next available field id is 17.
 */
export interface Span {
    /**
     * A unique identifier for a trace. All spans from the same trace share
     * the same `trace_id`. The ID is a 16-byte array. An ID with all zeroes
     * is considered invalid.
     *
     * This field is semantically required. Receiver should generate new
     * random trace_id if empty or invalid trace_id was received.
     *
     * This field is required.
     */
    traceId: Uint8Array;
    /**
     * A unique identifier for a span within a trace, assigned when the span
     * is created. The ID is an 8-byte array. An ID with all zeroes is considered
     * invalid.
     *
     * This field is semantically required. Receiver should generate new
     * random span_id if empty or invalid span_id was received.
     *
     * This field is required.
     */
    spanId: Uint8Array;
    /**
     * trace_state conveys information about request position in multiple distributed tracing graphs.
     * It is a trace_state in w3c-trace-context format: https://www.w3.org/TR/trace-context/#tracestate-header
     * See also https://github.com/w3c/distributed-tracing for more details about this field.
     */
    traceState: string;
    /**
     * The `span_id` of this span's parent span. If this is a root span, then this
     * field must be empty. The ID is an 8-byte array.
     */
    parentSpanId: Uint8Array;
    /**
     * A description of the span's operation.
     *
     * For example, the name can be a qualified method name or a file name
     * and a line number where the operation is called. A best practice is to use
     * the same display name at the same call point in an application.
     * This makes it easier to correlate spans in different traces.
     *
     * This field is semantically required to be set to non-empty string.
     * When null or empty string received - receiver may use string "name"
     * as a replacement. There might be smarted algorithms implemented by
     * receiver to fix the empty span name.
     *
     * This field is required.
     */
    name: string;
    /**
     * Distinguishes between spans generated in a particular context. For example,
     * two spans with the same name may be distinguished using `CLIENT` (caller)
     * and `SERVER` (callee) to identify queueing latency associated with the span.
     */
    kind: Span_SpanKind;
    /**
     * start_time_unix_nano is the start time of the span. On the client side, this is the time
     * kept by the local machine where the span execution starts. On the server side, this
     * is the time when the server's application handler starts running.
     * Value is UNIX Epoch time in nanoseconds since 00:00:00 UTC on 1 January 1970.
     *
     * This field is semantically required and it is expected that end_time >= start_time.
     */
    startTimeUnixNano: number;
    /**
     * end_time_unix_nano is the end time of the span. On the client side, this is the time
     * kept by the local machine where the span execution ends. On the server side, this
     * is the time when the server application handler stops running.
     * Value is UNIX Epoch time in nanoseconds since 00:00:00 UTC on 1 January 1970.
     *
     * This field is semantically required and it is expected that end_time >= start_time.
     */
    endTimeUnixNano: number;
    /**
     * attributes is a collection of key/value pairs. The value can be a string,
     * an integer, a double or the Boolean values `true` or `false`. Note, global attributes
     * like server name can be set using the resource API. Examples of attributes:
     *
     *     "/http/user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36"
     *     "/http/server_latency": 300
     *     "abc.com/myattribute": true
     *     "abc.com/score": 10.239
     */
    attributes: KeyValue[];
    /**
     * dropped_attributes_count is the number of attributes that were discarded. Attributes
     * can be discarded because their keys are too long or because there are too many
     * attributes. If this value is 0, then no attributes were dropped.
     */
    droppedAttributesCount: number;
    /** events is a collection of Event items. */
    events: Span_Event[];
    /**
     * dropped_events_count is the number of dropped events. If the value is 0, then no
     * events were dropped.
     */
    droppedEventsCount: number;
    /**
     * links is a collection of Links, which are references from this span to a span
     * in the same or different trace.
     */
    links: Span_Link[];
    /**
     * dropped_links_count is the number of dropped links after the maximum size was
     * enforced. If this value is 0, then no links were dropped.
     */
    droppedLinksCount: number;
    /**
     * An optional final status for this span. Semantically when Status isn't set, it means
     * span's status code is unset, i.e. assume STATUS_CODE_UNSET (code = 0).
     */
    status: Status | undefined;
}

/**
 * SpanKind is the type of span. Can be used to specify additional relationships between spans
 * in addition to a parent/child relationship.
 */
export enum Span_SpanKind {
    /**
     * SPAN_KIND_UNSPECIFIED - Unspecified. Do NOT use as default.
     * Implementations MAY assume SpanKind to be INTERNAL when receiving UNSPECIFIED.
     */
    SPAN_KIND_UNSPECIFIED = 0,
    /**
     * SPAN_KIND_INTERNAL - Indicates that the span represents an internal operation within an application,
     * as opposed to an operation happening at the boundaries. Default value.
     */
    SPAN_KIND_INTERNAL = 1,
    /**
     * SPAN_KIND_SERVER - Indicates that the span covers server-side handling of an RPC or other
     * remote network request.
     */
    SPAN_KIND_SERVER = 2,
    /** SPAN_KIND_CLIENT - Indicates that the span describes a request to some remote service. */
    SPAN_KIND_CLIENT = 3,
    /**
     * SPAN_KIND_PRODUCER - Indicates that the span describes a producer sending a message to a broker.
     * Unlike CLIENT and SERVER, there is often no direct critical path latency relationship
     * between producer and consumer spans. A PRODUCER span ends when the message was accepted
     * by the broker while the logical processing of the message might span a much longer time.
     */
    SPAN_KIND_PRODUCER = 4,
    /**
     * SPAN_KIND_CONSUMER - Indicates that the span describes consumer receiving a message from a broker.
     * Like the PRODUCER kind, there is often no direct critical path latency relationship
     * between producer and consumer spans.
     */
    SPAN_KIND_CONSUMER = 5,
    UNRECOGNIZED = -1,
}

export function span_SpanKindFromJSON(object: any): Span_SpanKind {
    switch (object) {
        case 0:
        case 'SPAN_KIND_UNSPECIFIED':
            return Span_SpanKind.SPAN_KIND_UNSPECIFIED;
        case 1:
        case 'SPAN_KIND_INTERNAL':
            return Span_SpanKind.SPAN_KIND_INTERNAL;
        case 2:
        case 'SPAN_KIND_SERVER':
            return Span_SpanKind.SPAN_KIND_SERVER;
        case 3:
        case 'SPAN_KIND_CLIENT':
            return Span_SpanKind.SPAN_KIND_CLIENT;
        case 4:
        case 'SPAN_KIND_PRODUCER':
            return Span_SpanKind.SPAN_KIND_PRODUCER;
        case 5:
        case 'SPAN_KIND_CONSUMER':
            return Span_SpanKind.SPAN_KIND_CONSUMER;
        case -1:
        case 'UNRECOGNIZED':
        default:
            return Span_SpanKind.UNRECOGNIZED;
    }
}

export function span_SpanKindToJSON(object: Span_SpanKind): string {
    switch (object) {
        case Span_SpanKind.SPAN_KIND_UNSPECIFIED:
            return 'SPAN_KIND_UNSPECIFIED';
        case Span_SpanKind.SPAN_KIND_INTERNAL:
            return 'SPAN_KIND_INTERNAL';
        case Span_SpanKind.SPAN_KIND_SERVER:
            return 'SPAN_KIND_SERVER';
        case Span_SpanKind.SPAN_KIND_CLIENT:
            return 'SPAN_KIND_CLIENT';
        case Span_SpanKind.SPAN_KIND_PRODUCER:
            return 'SPAN_KIND_PRODUCER';
        case Span_SpanKind.SPAN_KIND_CONSUMER:
            return 'SPAN_KIND_CONSUMER';
        default:
            return 'UNKNOWN';
    }
}

/**
 * Event is a time-stamped annotation of the span, consisting of user-supplied
 * text description and key-value pairs.
 */
export interface Span_Event {
    /** time_unix_nano is the time the event occurred. */
    timeUnixNano: number;
    /**
     * name of the event.
     * This field is semantically required to be set to non-empty string.
     */
    name: string;
    /** attributes is a collection of attribute key/value pairs on the event. */
    attributes: KeyValue[];
    /**
     * dropped_attributes_count is the number of dropped attributes. If the value is 0,
     * then no attributes were dropped.
     */
    droppedAttributesCount: number;
}

/**
 * A pointer from the current span to another span in the same trace or in a
 * different trace. For example, this can be used in batching operations,
 * where a single batch handler processes multiple requests from different
 * traces or when the handler receives a request from a different project.
 */
export interface Span_Link {
    /**
     * A unique identifier of a trace that this linked span is part of. The ID is a
     * 16-byte array.
     */
    traceId: Uint8Array;
    /** A unique identifier for the linked span. The ID is an 8-byte array. */
    spanId: Uint8Array;
    /** The trace_state associated with the link. */
    traceState: string;
    /** attributes is a collection of attribute key/value pairs on the link. */
    attributes: KeyValue[];
    /**
     * dropped_attributes_count is the number of dropped attributes. If the value is 0,
     * then no attributes were dropped.
     */
    droppedAttributesCount: number;
}

/**
 * The Status type defines a logical error model that is suitable for different
 * programming environments, including REST APIs and RPC APIs.
 */
export interface Status {
    /**
     * The deprecated status code. This is an optional field.
     *
     * This field is deprecated and is replaced by the `code` field below. See backward
     * compatibility notes below. According to our stability guarantees this field
     * will be removed in 12 months, on Oct 22, 2021. All usage of old senders and
     * receivers that do not understand the `code` field MUST be phased out by then.
     *
     * @deprecated
     */
    deprecatedCode: Status_DeprecatedStatusCode;
    /** A developer-facing human readable error message. */
    message: string;
    /** The status code. */
    code: Status_StatusCode;
}

export enum Status_DeprecatedStatusCode {
    DEPRECATED_STATUS_CODE_OK = 0,
    DEPRECATED_STATUS_CODE_CANCELLED = 1,
    DEPRECATED_STATUS_CODE_UNKNOWN_ERROR = 2,
    DEPRECATED_STATUS_CODE_INVALID_ARGUMENT = 3,
    DEPRECATED_STATUS_CODE_DEADLINE_EXCEEDED = 4,
    DEPRECATED_STATUS_CODE_NOT_FOUND = 5,
    DEPRECATED_STATUS_CODE_ALREADY_EXISTS = 6,
    DEPRECATED_STATUS_CODE_PERMISSION_DENIED = 7,
    DEPRECATED_STATUS_CODE_RESOURCE_EXHAUSTED = 8,
    DEPRECATED_STATUS_CODE_FAILED_PRECONDITION = 9,
    DEPRECATED_STATUS_CODE_ABORTED = 10,
    DEPRECATED_STATUS_CODE_OUT_OF_RANGE = 11,
    DEPRECATED_STATUS_CODE_UNIMPLEMENTED = 12,
    DEPRECATED_STATUS_CODE_INTERNAL_ERROR = 13,
    DEPRECATED_STATUS_CODE_UNAVAILABLE = 14,
    DEPRECATED_STATUS_CODE_DATA_LOSS = 15,
    DEPRECATED_STATUS_CODE_UNAUTHENTICATED = 16,
    UNRECOGNIZED = -1,
}

export function status_DeprecatedStatusCodeFromJSON(object: any): Status_DeprecatedStatusCode {
    switch (object) {
        case 0:
        case 'DEPRECATED_STATUS_CODE_OK':
            return Status_DeprecatedStatusCode.DEPRECATED_STATUS_CODE_OK;
        case 1:
        case 'DEPRECATED_STATUS_CODE_CANCELLED':
            return Status_DeprecatedStatusCode.DEPRECATED_STATUS_CODE_CANCELLED;
        case 2:
        case 'DEPRECATED_STATUS_CODE_UNKNOWN_ERROR':
            return Status_DeprecatedStatusCode.DEPRECATED_STATUS_CODE_UNKNOWN_ERROR;
        case 3:
        case 'DEPRECATED_STATUS_CODE_INVALID_ARGUMENT':
            return Status_DeprecatedStatusCode.DEPRECATED_STATUS_CODE_INVALID_ARGUMENT;
        case 4:
        case 'DEPRECATED_STATUS_CODE_DEADLINE_EXCEEDED':
            return Status_DeprecatedStatusCode.DEPRECATED_STATUS_CODE_DEADLINE_EXCEEDED;
        case 5:
        case 'DEPRECATED_STATUS_CODE_NOT_FOUND':
            return Status_DeprecatedStatusCode.DEPRECATED_STATUS_CODE_NOT_FOUND;
        case 6:
        case 'DEPRECATED_STATUS_CODE_ALREADY_EXISTS':
            return Status_DeprecatedStatusCode.DEPRECATED_STATUS_CODE_ALREADY_EXISTS;
        case 7:
        case 'DEPRECATED_STATUS_CODE_PERMISSION_DENIED':
            return Status_DeprecatedStatusCode.DEPRECATED_STATUS_CODE_PERMISSION_DENIED;
        case 8:
        case 'DEPRECATED_STATUS_CODE_RESOURCE_EXHAUSTED':
            return Status_DeprecatedStatusCode.DEPRECATED_STATUS_CODE_RESOURCE_EXHAUSTED;
        case 9:
        case 'DEPRECATED_STATUS_CODE_FAILED_PRECONDITION':
            return Status_DeprecatedStatusCode.DEPRECATED_STATUS_CODE_FAILED_PRECONDITION;
        case 10:
        case 'DEPRECATED_STATUS_CODE_ABORTED':
            return Status_DeprecatedStatusCode.DEPRECATED_STATUS_CODE_ABORTED;
        case 11:
        case 'DEPRECATED_STATUS_CODE_OUT_OF_RANGE':
            return Status_DeprecatedStatusCode.DEPRECATED_STATUS_CODE_OUT_OF_RANGE;
        case 12:
        case 'DEPRECATED_STATUS_CODE_UNIMPLEMENTED':
            return Status_DeprecatedStatusCode.DEPRECATED_STATUS_CODE_UNIMPLEMENTED;
        case 13:
        case 'DEPRECATED_STATUS_CODE_INTERNAL_ERROR':
            return Status_DeprecatedStatusCode.DEPRECATED_STATUS_CODE_INTERNAL_ERROR;
        case 14:
        case 'DEPRECATED_STATUS_CODE_UNAVAILABLE':
            return Status_DeprecatedStatusCode.DEPRECATED_STATUS_CODE_UNAVAILABLE;
        case 15:
        case 'DEPRECATED_STATUS_CODE_DATA_LOSS':
            return Status_DeprecatedStatusCode.DEPRECATED_STATUS_CODE_DATA_LOSS;
        case 16:
        case 'DEPRECATED_STATUS_CODE_UNAUTHENTICATED':
            return Status_DeprecatedStatusCode.DEPRECATED_STATUS_CODE_UNAUTHENTICATED;
        case -1:
        case 'UNRECOGNIZED':
        default:
            return Status_DeprecatedStatusCode.UNRECOGNIZED;
    }
}

export function status_DeprecatedStatusCodeToJSON(object: Status_DeprecatedStatusCode): string {
    switch (object) {
        case Status_DeprecatedStatusCode.DEPRECATED_STATUS_CODE_OK:
            return 'DEPRECATED_STATUS_CODE_OK';
        case Status_DeprecatedStatusCode.DEPRECATED_STATUS_CODE_CANCELLED:
            return 'DEPRECATED_STATUS_CODE_CANCELLED';
        case Status_DeprecatedStatusCode.DEPRECATED_STATUS_CODE_UNKNOWN_ERROR:
            return 'DEPRECATED_STATUS_CODE_UNKNOWN_ERROR';
        case Status_DeprecatedStatusCode.DEPRECATED_STATUS_CODE_INVALID_ARGUMENT:
            return 'DEPRECATED_STATUS_CODE_INVALID_ARGUMENT';
        case Status_DeprecatedStatusCode.DEPRECATED_STATUS_CODE_DEADLINE_EXCEEDED:
            return 'DEPRECATED_STATUS_CODE_DEADLINE_EXCEEDED';
        case Status_DeprecatedStatusCode.DEPRECATED_STATUS_CODE_NOT_FOUND:
            return 'DEPRECATED_STATUS_CODE_NOT_FOUND';
        case Status_DeprecatedStatusCode.DEPRECATED_STATUS_CODE_ALREADY_EXISTS:
            return 'DEPRECATED_STATUS_CODE_ALREADY_EXISTS';
        case Status_DeprecatedStatusCode.DEPRECATED_STATUS_CODE_PERMISSION_DENIED:
            return 'DEPRECATED_STATUS_CODE_PERMISSION_DENIED';
        case Status_DeprecatedStatusCode.DEPRECATED_STATUS_CODE_RESOURCE_EXHAUSTED:
            return 'DEPRECATED_STATUS_CODE_RESOURCE_EXHAUSTED';
        case Status_DeprecatedStatusCode.DEPRECATED_STATUS_CODE_FAILED_PRECONDITION:
            return 'DEPRECATED_STATUS_CODE_FAILED_PRECONDITION';
        case Status_DeprecatedStatusCode.DEPRECATED_STATUS_CODE_ABORTED:
            return 'DEPRECATED_STATUS_CODE_ABORTED';
        case Status_DeprecatedStatusCode.DEPRECATED_STATUS_CODE_OUT_OF_RANGE:
            return 'DEPRECATED_STATUS_CODE_OUT_OF_RANGE';
        case Status_DeprecatedStatusCode.DEPRECATED_STATUS_CODE_UNIMPLEMENTED:
            return 'DEPRECATED_STATUS_CODE_UNIMPLEMENTED';
        case Status_DeprecatedStatusCode.DEPRECATED_STATUS_CODE_INTERNAL_ERROR:
            return 'DEPRECATED_STATUS_CODE_INTERNAL_ERROR';
        case Status_DeprecatedStatusCode.DEPRECATED_STATUS_CODE_UNAVAILABLE:
            return 'DEPRECATED_STATUS_CODE_UNAVAILABLE';
        case Status_DeprecatedStatusCode.DEPRECATED_STATUS_CODE_DATA_LOSS:
            return 'DEPRECATED_STATUS_CODE_DATA_LOSS';
        case Status_DeprecatedStatusCode.DEPRECATED_STATUS_CODE_UNAUTHENTICATED:
            return 'DEPRECATED_STATUS_CODE_UNAUTHENTICATED';
        default:
            return 'UNKNOWN';
    }
}

/**
 * For the semantics of status codes see
 * https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/trace/api.md#set-status
 */
export enum Status_StatusCode {
    /** STATUS_CODE_UNSET - The default status. */
    STATUS_CODE_UNSET = 0,
    /**
     * STATUS_CODE_OK - The Span has been validated by an Application developers or Operator to have
     * completed successfully.
     */
    STATUS_CODE_OK = 1,
    /** STATUS_CODE_ERROR - The Span contains an error. */
    STATUS_CODE_ERROR = 2,
    UNRECOGNIZED = -1,
}

export function status_StatusCodeFromJSON(object: any): Status_StatusCode {
    switch (object) {
        case 0:
        case 'STATUS_CODE_UNSET':
            return Status_StatusCode.STATUS_CODE_UNSET;
        case 1:
        case 'STATUS_CODE_OK':
            return Status_StatusCode.STATUS_CODE_OK;
        case 2:
        case 'STATUS_CODE_ERROR':
            return Status_StatusCode.STATUS_CODE_ERROR;
        case -1:
        case 'UNRECOGNIZED':
        default:
            return Status_StatusCode.UNRECOGNIZED;
    }
}

export function status_StatusCodeToJSON(object: Status_StatusCode): string {
    switch (object) {
        case Status_StatusCode.STATUS_CODE_UNSET:
            return 'STATUS_CODE_UNSET';
        case Status_StatusCode.STATUS_CODE_OK:
            return 'STATUS_CODE_OK';
        case Status_StatusCode.STATUS_CODE_ERROR:
            return 'STATUS_CODE_ERROR';
        default:
            return 'UNKNOWN';
    }
}

const baseResourceSpans: object = {};

export const ResourceSpans = {
    encode(message: ResourceSpans, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
        if (message.resource !== undefined) {
            Resource.encode(message.resource, writer.uint32(10).fork()).ldelim();
        }
        for (const v of message.instrumentationLibrarySpans) {
            InstrumentationLibrarySpans.encode(v!, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },

    decode(input: _m0.Reader | Uint8Array, length?: number): ResourceSpans {
        const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = { ...baseResourceSpans } as ResourceSpans;
        message.instrumentationLibrarySpans = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.resource = Resource.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.instrumentationLibrarySpans.push(
                        InstrumentationLibrarySpans.decode(reader, reader.uint32())
                    );
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },

    fromJSON(object: any): ResourceSpans {
        const message = { ...baseResourceSpans } as ResourceSpans;
        message.instrumentationLibrarySpans = [];
        if (object.resource !== undefined && object.resource !== null) {
            message.resource = Resource.fromJSON(object.resource);
        } else {
            message.resource = undefined;
        }
        if (object.instrumentationLibrarySpans !== undefined && object.instrumentationLibrarySpans !== null) {
            for (const e of object.instrumentationLibrarySpans) {
                message.instrumentationLibrarySpans.push(InstrumentationLibrarySpans.fromJSON(e));
            }
        }
        return message;
    },

    toJSON(message: ResourceSpans): unknown {
        const obj: any = {};
        message.resource !== undefined &&
            (obj.resource = message.resource ? Resource.toJSON(message.resource) : undefined);
        if (message.instrumentationLibrarySpans) {
            obj.instrumentationLibrarySpans = message.instrumentationLibrarySpans.map((e) =>
                e ? InstrumentationLibrarySpans.toJSON(e) : undefined
            );
        } else {
            obj.instrumentationLibrarySpans = [];
        }
        return obj;
    },

    fromPartial(object: DeepPartial<ResourceSpans>): ResourceSpans {
        const message = { ...baseResourceSpans } as ResourceSpans;
        message.instrumentationLibrarySpans = [];
        if (object.resource !== undefined && object.resource !== null) {
            message.resource = Resource.fromPartial(object.resource);
        } else {
            message.resource = undefined;
        }
        if (object.instrumentationLibrarySpans !== undefined && object.instrumentationLibrarySpans !== null) {
            for (const e of object.instrumentationLibrarySpans) {
                message.instrumentationLibrarySpans.push(InstrumentationLibrarySpans.fromPartial(e));
            }
        }
        return message;
    },
};

const baseInstrumentationLibrarySpans: object = {};

export const InstrumentationLibrarySpans = {
    encode(message: InstrumentationLibrarySpans, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
        if (message.instrumentationLibrary !== undefined) {
            InstrumentationLibrary.encode(message.instrumentationLibrary, writer.uint32(10).fork()).ldelim();
        }
        for (const v of message.spans) {
            Span.encode(v!, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },

    decode(input: _m0.Reader | Uint8Array, length?: number): InstrumentationLibrarySpans {
        const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = {
            ...baseInstrumentationLibrarySpans,
        } as InstrumentationLibrarySpans;
        message.spans = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.instrumentationLibrary = InstrumentationLibrary.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.spans.push(Span.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },

    fromJSON(object: any): InstrumentationLibrarySpans {
        const message = {
            ...baseInstrumentationLibrarySpans,
        } as InstrumentationLibrarySpans;
        message.spans = [];
        if (object.instrumentationLibrary !== undefined && object.instrumentationLibrary !== null) {
            message.instrumentationLibrary = InstrumentationLibrary.fromJSON(object.instrumentationLibrary);
        } else {
            message.instrumentationLibrary = undefined;
        }
        if (object.spans !== undefined && object.spans !== null) {
            for (const e of object.spans) {
                message.spans.push(Span.fromJSON(e));
            }
        }
        return message;
    },

    toJSON(message: InstrumentationLibrarySpans): unknown {
        const obj: any = {};
        message.instrumentationLibrary !== undefined &&
            (obj.instrumentationLibrary = message.instrumentationLibrary
                ? InstrumentationLibrary.toJSON(message.instrumentationLibrary)
                : undefined);
        if (message.spans) {
            obj.spans = message.spans.map((e) => (e ? Span.toJSON(e) : undefined));
        } else {
            obj.spans = [];
        }
        return obj;
    },

    fromPartial(object: DeepPartial<InstrumentationLibrarySpans>): InstrumentationLibrarySpans {
        const message = {
            ...baseInstrumentationLibrarySpans,
        } as InstrumentationLibrarySpans;
        message.spans = [];
        if (object.instrumentationLibrary !== undefined && object.instrumentationLibrary !== null) {
            message.instrumentationLibrary = InstrumentationLibrary.fromPartial(object.instrumentationLibrary);
        } else {
            message.instrumentationLibrary = undefined;
        }
        if (object.spans !== undefined && object.spans !== null) {
            for (const e of object.spans) {
                message.spans.push(Span.fromPartial(e));
            }
        }
        return message;
    },
};

const baseSpan: object = {
    traceState: '',
    name: '',
    kind: 0,
    startTimeUnixNano: 0,
    endTimeUnixNano: 0,
    droppedAttributesCount: 0,
    droppedEventsCount: 0,
    droppedLinksCount: 0,
};

export const Span = {
    encode(message: Span, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
        if (message.traceId.length !== 0) {
            writer.uint32(10).bytes(message.traceId);
        }
        if (message.spanId.length !== 0) {
            writer.uint32(18).bytes(message.spanId);
        }
        if (message.traceState !== '') {
            writer.uint32(26).string(message.traceState);
        }
        if (message.parentSpanId.length !== 0) {
            writer.uint32(34).bytes(message.parentSpanId);
        }
        if (message.name !== '') {
            writer.uint32(42).string(message.name);
        }
        if (message.kind !== 0) {
            writer.uint32(48).int32(message.kind);
        }
        if (message.startTimeUnixNano !== 0) {
            writer.uint32(57).fixed64(message.startTimeUnixNano);
        }
        if (message.endTimeUnixNano !== 0) {
            writer.uint32(65).fixed64(message.endTimeUnixNano);
        }
        for (const v of message.attributes) {
            KeyValue.encode(v!, writer.uint32(74).fork()).ldelim();
        }
        if (message.droppedAttributesCount !== 0) {
            writer.uint32(80).uint32(message.droppedAttributesCount);
        }
        for (const v of message.events) {
            Span_Event.encode(v!, writer.uint32(90).fork()).ldelim();
        }
        if (message.droppedEventsCount !== 0) {
            writer.uint32(96).uint32(message.droppedEventsCount);
        }
        for (const v of message.links) {
            Span_Link.encode(v!, writer.uint32(106).fork()).ldelim();
        }
        if (message.droppedLinksCount !== 0) {
            writer.uint32(112).uint32(message.droppedLinksCount);
        }
        if (message.status !== undefined) {
            Status.encode(message.status, writer.uint32(122).fork()).ldelim();
        }
        return writer;
    },

    decode(input: _m0.Reader | Uint8Array, length?: number): Span {
        const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = { ...baseSpan } as Span;
        message.attributes = [];
        message.events = [];
        message.links = [];
        message.traceId = new Uint8Array();
        message.spanId = new Uint8Array();
        message.parentSpanId = new Uint8Array();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.traceId = reader.bytes();
                    break;
                case 2:
                    message.spanId = reader.bytes();
                    break;
                case 3:
                    message.traceState = reader.string();
                    break;
                case 4:
                    message.parentSpanId = reader.bytes();
                    break;
                case 5:
                    message.name = reader.string();
                    break;
                case 6:
                    message.kind = reader.int32() as any;
                    break;
                case 7:
                    message.startTimeUnixNano = longToNumber(reader.fixed64() as Long);
                    break;
                case 8:
                    message.endTimeUnixNano = longToNumber(reader.fixed64() as Long);
                    break;
                case 9:
                    message.attributes.push(KeyValue.decode(reader, reader.uint32()));
                    break;
                case 10:
                    message.droppedAttributesCount = reader.uint32();
                    break;
                case 11:
                    message.events.push(Span_Event.decode(reader, reader.uint32()));
                    break;
                case 12:
                    message.droppedEventsCount = reader.uint32();
                    break;
                case 13:
                    message.links.push(Span_Link.decode(reader, reader.uint32()));
                    break;
                case 14:
                    message.droppedLinksCount = reader.uint32();
                    break;
                case 15:
                    message.status = Status.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },

    fromJSON(object: any): Span {
        const message = { ...baseSpan } as Span;
        message.attributes = [];
        message.events = [];
        message.links = [];
        message.traceId = new Uint8Array();
        message.spanId = new Uint8Array();
        message.parentSpanId = new Uint8Array();
        if (object.traceId !== undefined && object.traceId !== null) {
            message.traceId = bytesFromBase64(object.traceId);
        }
        if (object.spanId !== undefined && object.spanId !== null) {
            message.spanId = bytesFromBase64(object.spanId);
        }
        if (object.traceState !== undefined && object.traceState !== null) {
            message.traceState = String(object.traceState);
        } else {
            message.traceState = '';
        }
        if (object.parentSpanId !== undefined && object.parentSpanId !== null) {
            message.parentSpanId = bytesFromBase64(object.parentSpanId);
        }
        if (object.name !== undefined && object.name !== null) {
            message.name = String(object.name);
        } else {
            message.name = '';
        }
        if (object.kind !== undefined && object.kind !== null) {
            message.kind = span_SpanKindFromJSON(object.kind);
        } else {
            message.kind = 0;
        }
        if (object.startTimeUnixNano !== undefined && object.startTimeUnixNano !== null) {
            message.startTimeUnixNano = Number(object.startTimeUnixNano);
        } else {
            message.startTimeUnixNano = 0;
        }
        if (object.endTimeUnixNano !== undefined && object.endTimeUnixNano !== null) {
            message.endTimeUnixNano = Number(object.endTimeUnixNano);
        } else {
            message.endTimeUnixNano = 0;
        }
        if (object.attributes !== undefined && object.attributes !== null) {
            for (const e of object.attributes) {
                message.attributes.push(KeyValue.fromJSON(e));
            }
        }
        if (object.droppedAttributesCount !== undefined && object.droppedAttributesCount !== null) {
            message.droppedAttributesCount = Number(object.droppedAttributesCount);
        } else {
            message.droppedAttributesCount = 0;
        }
        if (object.events !== undefined && object.events !== null) {
            for (const e of object.events) {
                message.events.push(Span_Event.fromJSON(e));
            }
        }
        if (object.droppedEventsCount !== undefined && object.droppedEventsCount !== null) {
            message.droppedEventsCount = Number(object.droppedEventsCount);
        } else {
            message.droppedEventsCount = 0;
        }
        if (object.links !== undefined && object.links !== null) {
            for (const e of object.links) {
                message.links.push(Span_Link.fromJSON(e));
            }
        }
        if (object.droppedLinksCount !== undefined && object.droppedLinksCount !== null) {
            message.droppedLinksCount = Number(object.droppedLinksCount);
        } else {
            message.droppedLinksCount = 0;
        }
        if (object.status !== undefined && object.status !== null) {
            message.status = Status.fromJSON(object.status);
        } else {
            message.status = undefined;
        }
        return message;
    },

    toJSON(message: Span): unknown {
        const obj: any = {};
        message.traceId !== undefined &&
            (obj.traceId = base64FromBytes(message.traceId !== undefined ? message.traceId : new Uint8Array()));
        message.spanId !== undefined &&
            (obj.spanId = base64FromBytes(message.spanId !== undefined ? message.spanId : new Uint8Array()));
        message.traceState !== undefined && (obj.traceState = message.traceState);
        message.parentSpanId !== undefined &&
            (obj.parentSpanId = base64FromBytes(
                message.parentSpanId !== undefined ? message.parentSpanId : new Uint8Array()
            ));
        message.name !== undefined && (obj.name = message.name);
        message.kind !== undefined && (obj.kind = span_SpanKindToJSON(message.kind));
        message.startTimeUnixNano !== undefined && (obj.startTimeUnixNano = message.startTimeUnixNano);
        message.endTimeUnixNano !== undefined && (obj.endTimeUnixNano = message.endTimeUnixNano);
        if (message.attributes) {
            obj.attributes = message.attributes.map((e) => (e ? KeyValue.toJSON(e) : undefined));
        } else {
            obj.attributes = [];
        }
        message.droppedAttributesCount !== undefined && (obj.droppedAttributesCount = message.droppedAttributesCount);
        if (message.events) {
            obj.events = message.events.map((e) => (e ? Span_Event.toJSON(e) : undefined));
        } else {
            obj.events = [];
        }
        message.droppedEventsCount !== undefined && (obj.droppedEventsCount = message.droppedEventsCount);
        if (message.links) {
            obj.links = message.links.map((e) => (e ? Span_Link.toJSON(e) : undefined));
        } else {
            obj.links = [];
        }
        message.droppedLinksCount !== undefined && (obj.droppedLinksCount = message.droppedLinksCount);
        message.status !== undefined && (obj.status = message.status ? Status.toJSON(message.status) : undefined);
        return obj;
    },

    fromPartial(object: DeepPartial<Span>): Span {
        const message = { ...baseSpan } as Span;
        message.attributes = [];
        message.events = [];
        message.links = [];
        if (object.traceId !== undefined && object.traceId !== null) {
            message.traceId = object.traceId;
        } else {
            message.traceId = new Uint8Array();
        }
        if (object.spanId !== undefined && object.spanId !== null) {
            message.spanId = object.spanId;
        } else {
            message.spanId = new Uint8Array();
        }
        if (object.traceState !== undefined && object.traceState !== null) {
            message.traceState = object.traceState;
        } else {
            message.traceState = '';
        }
        if (object.parentSpanId !== undefined && object.parentSpanId !== null) {
            message.parentSpanId = object.parentSpanId;
        } else {
            message.parentSpanId = new Uint8Array();
        }
        if (object.name !== undefined && object.name !== null) {
            message.name = object.name;
        } else {
            message.name = '';
        }
        if (object.kind !== undefined && object.kind !== null) {
            message.kind = object.kind;
        } else {
            message.kind = 0;
        }
        if (object.startTimeUnixNano !== undefined && object.startTimeUnixNano !== null) {
            message.startTimeUnixNano = object.startTimeUnixNano;
        } else {
            message.startTimeUnixNano = 0;
        }
        if (object.endTimeUnixNano !== undefined && object.endTimeUnixNano !== null) {
            message.endTimeUnixNano = object.endTimeUnixNano;
        } else {
            message.endTimeUnixNano = 0;
        }
        if (object.attributes !== undefined && object.attributes !== null) {
            for (const e of object.attributes) {
                message.attributes.push(KeyValue.fromPartial(e));
            }
        }
        if (object.droppedAttributesCount !== undefined && object.droppedAttributesCount !== null) {
            message.droppedAttributesCount = object.droppedAttributesCount;
        } else {
            message.droppedAttributesCount = 0;
        }
        if (object.events !== undefined && object.events !== null) {
            for (const e of object.events) {
                message.events.push(Span_Event.fromPartial(e));
            }
        }
        if (object.droppedEventsCount !== undefined && object.droppedEventsCount !== null) {
            message.droppedEventsCount = object.droppedEventsCount;
        } else {
            message.droppedEventsCount = 0;
        }
        if (object.links !== undefined && object.links !== null) {
            for (const e of object.links) {
                message.links.push(Span_Link.fromPartial(e));
            }
        }
        if (object.droppedLinksCount !== undefined && object.droppedLinksCount !== null) {
            message.droppedLinksCount = object.droppedLinksCount;
        } else {
            message.droppedLinksCount = 0;
        }
        if (object.status !== undefined && object.status !== null) {
            message.status = Status.fromPartial(object.status);
        } else {
            message.status = undefined;
        }
        return message;
    },
};

const baseSpan_Event: object = {
    timeUnixNano: 0,
    name: '',
    droppedAttributesCount: 0,
};

export const Span_Event = {
    encode(message: Span_Event, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
        if (message.timeUnixNano !== 0) {
            writer.uint32(9).fixed64(message.timeUnixNano);
        }
        if (message.name !== '') {
            writer.uint32(18).string(message.name);
        }
        for (const v of message.attributes) {
            KeyValue.encode(v!, writer.uint32(26).fork()).ldelim();
        }
        if (message.droppedAttributesCount !== 0) {
            writer.uint32(32).uint32(message.droppedAttributesCount);
        }
        return writer;
    },

    decode(input: _m0.Reader | Uint8Array, length?: number): Span_Event {
        const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = { ...baseSpan_Event } as Span_Event;
        message.attributes = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.timeUnixNano = longToNumber(reader.fixed64() as Long);
                    break;
                case 2:
                    message.name = reader.string();
                    break;
                case 3:
                    message.attributes.push(KeyValue.decode(reader, reader.uint32()));
                    break;
                case 4:
                    message.droppedAttributesCount = reader.uint32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },

    fromJSON(object: any): Span_Event {
        const message = { ...baseSpan_Event } as Span_Event;
        message.attributes = [];
        if (object.timeUnixNano !== undefined && object.timeUnixNano !== null) {
            message.timeUnixNano = Number(object.timeUnixNano);
        } else {
            message.timeUnixNano = 0;
        }
        if (object.name !== undefined && object.name !== null) {
            message.name = String(object.name);
        } else {
            message.name = '';
        }
        if (object.attributes !== undefined && object.attributes !== null) {
            for (const e of object.attributes) {
                message.attributes.push(KeyValue.fromJSON(e));
            }
        }
        if (object.droppedAttributesCount !== undefined && object.droppedAttributesCount !== null) {
            message.droppedAttributesCount = Number(object.droppedAttributesCount);
        } else {
            message.droppedAttributesCount = 0;
        }
        return message;
    },

    toJSON(message: Span_Event): unknown {
        const obj: any = {};
        message.timeUnixNano !== undefined && (obj.timeUnixNano = message.timeUnixNano);
        message.name !== undefined && (obj.name = message.name);
        if (message.attributes) {
            obj.attributes = message.attributes.map((e) => (e ? KeyValue.toJSON(e) : undefined));
        } else {
            obj.attributes = [];
        }
        message.droppedAttributesCount !== undefined && (obj.droppedAttributesCount = message.droppedAttributesCount);
        return obj;
    },

    fromPartial(object: DeepPartial<Span_Event>): Span_Event {
        const message = { ...baseSpan_Event } as Span_Event;
        message.attributes = [];
        if (object.timeUnixNano !== undefined && object.timeUnixNano !== null) {
            message.timeUnixNano = object.timeUnixNano;
        } else {
            message.timeUnixNano = 0;
        }
        if (object.name !== undefined && object.name !== null) {
            message.name = object.name;
        } else {
            message.name = '';
        }
        if (object.attributes !== undefined && object.attributes !== null) {
            for (const e of object.attributes) {
                message.attributes.push(KeyValue.fromPartial(e));
            }
        }
        if (object.droppedAttributesCount !== undefined && object.droppedAttributesCount !== null) {
            message.droppedAttributesCount = object.droppedAttributesCount;
        } else {
            message.droppedAttributesCount = 0;
        }
        return message;
    },
};

const baseSpan_Link: object = { traceState: '', droppedAttributesCount: 0 };

export const Span_Link = {
    encode(message: Span_Link, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
        if (message.traceId.length !== 0) {
            writer.uint32(10).bytes(message.traceId);
        }
        if (message.spanId.length !== 0) {
            writer.uint32(18).bytes(message.spanId);
        }
        if (message.traceState !== '') {
            writer.uint32(26).string(message.traceState);
        }
        for (const v of message.attributes) {
            KeyValue.encode(v!, writer.uint32(34).fork()).ldelim();
        }
        if (message.droppedAttributesCount !== 0) {
            writer.uint32(40).uint32(message.droppedAttributesCount);
        }
        return writer;
    },

    decode(input: _m0.Reader | Uint8Array, length?: number): Span_Link {
        const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = { ...baseSpan_Link } as Span_Link;
        message.attributes = [];
        message.traceId = new Uint8Array();
        message.spanId = new Uint8Array();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.traceId = reader.bytes();
                    break;
                case 2:
                    message.spanId = reader.bytes();
                    break;
                case 3:
                    message.traceState = reader.string();
                    break;
                case 4:
                    message.attributes.push(KeyValue.decode(reader, reader.uint32()));
                    break;
                case 5:
                    message.droppedAttributesCount = reader.uint32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },

    fromJSON(object: any): Span_Link {
        const message = { ...baseSpan_Link } as Span_Link;
        message.attributes = [];
        message.traceId = new Uint8Array();
        message.spanId = new Uint8Array();
        if (object.traceId !== undefined && object.traceId !== null) {
            message.traceId = bytesFromBase64(object.traceId);
        }
        if (object.spanId !== undefined && object.spanId !== null) {
            message.spanId = bytesFromBase64(object.spanId);
        }
        if (object.traceState !== undefined && object.traceState !== null) {
            message.traceState = String(object.traceState);
        } else {
            message.traceState = '';
        }
        if (object.attributes !== undefined && object.attributes !== null) {
            for (const e of object.attributes) {
                message.attributes.push(KeyValue.fromJSON(e));
            }
        }
        if (object.droppedAttributesCount !== undefined && object.droppedAttributesCount !== null) {
            message.droppedAttributesCount = Number(object.droppedAttributesCount);
        } else {
            message.droppedAttributesCount = 0;
        }
        return message;
    },

    toJSON(message: Span_Link): unknown {
        const obj: any = {};
        message.traceId !== undefined &&
            (obj.traceId = base64FromBytes(message.traceId !== undefined ? message.traceId : new Uint8Array()));
        message.spanId !== undefined &&
            (obj.spanId = base64FromBytes(message.spanId !== undefined ? message.spanId : new Uint8Array()));
        message.traceState !== undefined && (obj.traceState = message.traceState);
        if (message.attributes) {
            obj.attributes = message.attributes.map((e) => (e ? KeyValue.toJSON(e) : undefined));
        } else {
            obj.attributes = [];
        }
        message.droppedAttributesCount !== undefined && (obj.droppedAttributesCount = message.droppedAttributesCount);
        return obj;
    },

    fromPartial(object: DeepPartial<Span_Link>): Span_Link {
        const message = { ...baseSpan_Link } as Span_Link;
        message.attributes = [];
        if (object.traceId !== undefined && object.traceId !== null) {
            message.traceId = object.traceId;
        } else {
            message.traceId = new Uint8Array();
        }
        if (object.spanId !== undefined && object.spanId !== null) {
            message.spanId = object.spanId;
        } else {
            message.spanId = new Uint8Array();
        }
        if (object.traceState !== undefined && object.traceState !== null) {
            message.traceState = object.traceState;
        } else {
            message.traceState = '';
        }
        if (object.attributes !== undefined && object.attributes !== null) {
            for (const e of object.attributes) {
                message.attributes.push(KeyValue.fromPartial(e));
            }
        }
        if (object.droppedAttributesCount !== undefined && object.droppedAttributesCount !== null) {
            message.droppedAttributesCount = object.droppedAttributesCount;
        } else {
            message.droppedAttributesCount = 0;
        }
        return message;
    },
};

const baseStatus: object = { deprecatedCode: 0, message: '', code: 0 };

export const Status = {
    encode(message: Status, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
        if (message.deprecatedCode !== 0) {
            writer.uint32(8).int32(message.deprecatedCode);
        }
        if (message.message !== '') {
            writer.uint32(18).string(message.message);
        }
        if (message.code !== 0) {
            writer.uint32(24).int32(message.code);
        }
        return writer;
    },

    decode(input: _m0.Reader | Uint8Array, length?: number): Status {
        const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = { ...baseStatus } as Status;
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.deprecatedCode = reader.int32() as any;
                    break;
                case 2:
                    message.message = reader.string();
                    break;
                case 3:
                    message.code = reader.int32() as any;
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },

    fromJSON(object: any): Status {
        const message = { ...baseStatus } as Status;
        if (object.deprecatedCode !== undefined && object.deprecatedCode !== null) {
            message.deprecatedCode = status_DeprecatedStatusCodeFromJSON(object.deprecatedCode);
        } else {
            message.deprecatedCode = 0;
        }
        if (object.message !== undefined && object.message !== null) {
            message.message = String(object.message);
        } else {
            message.message = '';
        }
        if (object.code !== undefined && object.code !== null) {
            message.code = status_StatusCodeFromJSON(object.code);
        } else {
            message.code = 0;
        }
        return message;
    },

    toJSON(message: Status): unknown {
        const obj: any = {};
        message.deprecatedCode !== undefined &&
            (obj.deprecatedCode = status_DeprecatedStatusCodeToJSON(message.deprecatedCode));
        message.message !== undefined && (obj.message = message.message);
        message.code !== undefined && (obj.code = status_StatusCodeToJSON(message.code));
        return obj;
    },

    fromPartial(object: DeepPartial<Status>): Status {
        const message = { ...baseStatus } as Status;
        if (object.deprecatedCode !== undefined && object.deprecatedCode !== null) {
            message.deprecatedCode = object.deprecatedCode;
        } else {
            message.deprecatedCode = 0;
        }
        if (object.message !== undefined && object.message !== null) {
            message.message = object.message;
        } else {
            message.message = '';
        }
        if (object.code !== undefined && object.code !== null) {
            message.code = object.code;
        } else {
            message.code = 0;
        }
        return message;
    },
};

declare var self: any | undefined;
declare var window: any | undefined;
var globalThis: any = (() => {
    if (typeof globalThis !== 'undefined') return globalThis;
    if (typeof self !== 'undefined') return self;
    if (typeof window !== 'undefined') return window;
    if (typeof global !== 'undefined') return global;
    throw 'Unable to locate global object';
})();

const atob: (b64: string) => string =
    globalThis.atob || ((b64) => globalThis.Buffer.from(b64, 'base64').toString('binary'));
function bytesFromBase64(b64: string): Uint8Array {
    const bin = atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
        arr[i] = bin.charCodeAt(i);
    }
    return arr;
}

const btoa: (bin: string) => string =
    globalThis.btoa || ((bin) => globalThis.Buffer.from(bin, 'binary').toString('base64'));
function base64FromBytes(arr: Uint8Array): string {
    const bin: string[] = [];
    for (let i = 0; i < arr.byteLength; ++i) {
        bin.push(String.fromCharCode(arr[i]));
    }
    return btoa(bin.join(''));
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;
export type DeepPartial<T> = T extends Builtin
    ? T
    : T extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T extends ReadonlyArray<infer U>
    ? ReadonlyArray<DeepPartial<U>>
    : T extends {}
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : Partial<T>;

function longToNumber(long: Long): number {
    if (long.gt(Number.MAX_SAFE_INTEGER)) {
        throw new globalThis.Error('Value is larger than Number.MAX_SAFE_INTEGER');
    }
    return long.toNumber();
}

if (_m0.util.Long !== Long) {
    _m0.util.Long = Long as any;
    _m0.configure();
}
