import { fromProtoResourceSpansArray, toProtoResourceSpansArray } from '../../../trace/v1/transform';
import * as tracing from '@opentelemetry/tracing';
import * as resources from '@opentelemetry/resources';
import * as proto from './trace_service';
import { bytesArrayToHex, hexToBytesArray } from '../../../../../utils';

export function toProtoExportTraceServiceRequest(
    sdkSpans: tracing.ReadableSpan[],
    additionalAttributes: resources.ResourceAttributes = {}
): proto.ExportTraceServiceRequest {
    return {
        resourceSpans: toProtoResourceSpansArray(sdkSpans, additionalAttributes),
    };
}

export function fromProtoExportTraceServiceRequest(
    protoExportTraceServiceRequest: proto.ExportTraceServiceRequest
): tracing.ReadableSpan[] {
    return fromProtoResourceSpansArray(protoExportTraceServiceRequest.resourceSpans);
}

/**
 * Serialize the ExportTraceServiceRequest message into Json-Encoded Protobuf format.
 *
 * From the spec:
 * JSON-encoded Protobuf payloads use proto3 standard defined JSON Mapping for mapping
 * between Protobuf and JSON, with one deviation from that mapping: the trace_id and
 * span_id byte arrays are represented as case-insensitive hex-encoded strings,
 * they are not base64-encoded like it is defined in the standard JSON Mapping.
 * The hex encoding is used for trace_id and span_id fields in all OTLP Protobuf messages,
 * e.g. the Span, Link, LogRecord, etc. messages.
 *
 * This function replaces the trace and span ids to be hex-encoded string, and return the
 * JSON.serialize payload for the request
 *
 * Spec for reference:
 * https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/protocol/otlp.md#otlphttp
 */
export function toJsonEncodedProtobufFormat(exportTraceServiceRequest: proto.ExportTraceServiceRequest): string {
    const withHexStringIds = {
        resourceSpans: exportTraceServiceRequest.resourceSpans.map((resourceSpan) => ({
            ...resourceSpan,
            instrumentationLibrarySpans: resourceSpan.instrumentationLibrarySpans.map(
                (instrumentationLibrarySpans) => ({
                    ...instrumentationLibrarySpans,
                    spans: instrumentationLibrarySpans.spans.map((span) => ({
                        ...span,
                        traceId: bytesArrayToHex(span.traceId),
                        spanId: bytesArrayToHex(span.spanId),
                        parentSpanId: span.parentSpanId ? bytesArrayToHex(span.parentSpanId) : span.parentSpanId,
                        links: span.links.map((link) => ({
                            ...link,
                            traceId: bytesArrayToHex(link.traceId),
                            spanId: bytesArrayToHex(link.spanId),
                        })),
                    })),
                })
            ),
        })),
    };
    return JSON.stringify(withHexStringIds);
}

export function fromJsonEncodedProtobufFormat(jsonStringifyPayload: string): proto.ExportTraceServiceRequest {
    const jsonPayload = JSON.parse(jsonStringifyPayload);
    return {
        resourceSpans: jsonPayload.resourceSpans.map((resourceSpan) => ({
            ...resourceSpan,
            instrumentationLibrarySpans: resourceSpan.instrumentationLibrarySpans.map(
                (instrumentationLibrarySpans) => ({
                    ...instrumentationLibrarySpans,
                    spans: instrumentationLibrarySpans.spans.map((span) => ({
                        ...span,
                        traceId: hexToBytesArray(span.traceId),
                        spanId: hexToBytesArray(span.spanId),
                        parentSpanId: span.parentSpanId ? hexToBytesArray(span.parentSpanId) : span.parentSpanId,
                        links: span.links.map((link) => ({
                            ...link,
                            traceId: hexToBytesArray(link.traceId),
                            spanId: hexToBytesArray(link.spanId),
                        })),
                    })),
                })
            ),
        })),
    };
}
