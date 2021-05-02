import * as tracing from '@opentelemetry/tracing';
import * as resources from '@opentelemetry/resources';
import * as core from '@opentelemetry/core';
import * as api from '@opentelemetry/api';

import * as proto from './trace';
import { toResource } from '../../resource/v1/transform';
import { toInstrumentationLibrary, toKeyValue, toProtoSpanAttributes } from '../../common/v1/transform';

function groupSpansByResource(spans: tracing.ReadableSpan[]): Map<resources.Resource, tracing.ReadableSpan[]> {
    return spans.reduce((byResourceMap, sdkSpan) => {
        if (!byResourceMap.has(sdkSpan.resource)) {
            byResourceMap.set(sdkSpan.resource, []);
        }
        byResourceMap.get(sdkSpan.resource).push(sdkSpan);
        return byResourceMap;
    }, new Map<resources.Resource, tracing.ReadableSpan[]>());
}

function groupSpansByInstrumentationLibrary(
    spans: tracing.ReadableSpan[]
): Map<core.InstrumentationLibrary, tracing.ReadableSpan[]> {
    return spans.reduce((byInstrumentationLibraryMap, sdkSpan) => {
        if (!byInstrumentationLibraryMap.has(sdkSpan.instrumentationLibrary)) {
            byInstrumentationLibraryMap.set(sdkSpan.instrumentationLibrary, []);
        }
        byInstrumentationLibraryMap.get(sdkSpan.instrumentationLibrary).push(sdkSpan);
        return byInstrumentationLibraryMap;
    }, new Map<core.InstrumentationLibrary, tracing.ReadableSpan[]>());
}

export function hexToBytesArray(hexStr: string): Uint8Array {
    const hexStrLen = hexStr.length;
    let bytesArray: number[] = [];
    for (let i = 0; i < hexStrLen; i += 2) {
        const hexPair = hexStr.substring(i, i + 2);
        const hexVal = parseInt(hexPair, 16);
        bytesArray.push(hexVal);
    }
    return Uint8Array.from(bytesArray);
}

export const spanKindToProtoMap = new Map<api.SpanKind, proto.Span_SpanKind>([
    [api.SpanKind.INTERNAL, proto.Span_SpanKind.SPAN_KIND_INTERNAL],
    [api.SpanKind.SERVER, proto.Span_SpanKind.SPAN_KIND_SERVER],
    [api.SpanKind.CLIENT, proto.Span_SpanKind.SPAN_KIND_CLIENT],
    [api.SpanKind.PRODUCER, proto.Span_SpanKind.SPAN_KIND_PRODUCER],
    [api.SpanKind.CONSUMER, proto.Span_SpanKind.SPAN_KIND_CONSUMER],
]);

export const spanStatusCodeToProtoMap = new Map<api.SpanStatusCode, proto.Status_StatusCode>([
    [api.SpanStatusCode.UNSET, proto.Status_StatusCode.STATUS_CODE_UNSET],
    [api.SpanStatusCode.OK, proto.Status_StatusCode.STATUS_CODE_OK],
    [api.SpanStatusCode.ERROR, proto.Status_StatusCode.STATUS_CODE_ERROR],
]);

export function toProtoTraceState(sdkTraceState?: api.TraceState): string | undefined {
    if (!sdkTraceState) return undefined;
    return sdkTraceState.serialize();
}

export function toProtoSpanEvent(sdkSpanEvent: api.TimedEvent): proto.Span_Event {
    return {
        timeUnixNano: core.hrTimeToNanoseconds(sdkSpanEvent.time),
        name: sdkSpanEvent.name,
        attributes: toProtoSpanAttributes(sdkSpanEvent.attributes ?? {}),
        droppedAttributesCount: 0,
    };
}

export function toProtoSpanLink(sdkLink: api.Link): proto.Span_Link {
    return {
        traceId: hexToBytesArray(sdkLink.context.traceId),
        spanId: hexToBytesArray(sdkLink.context.spanId),
        traceState: 'TODO', // https://github.com/open-telemetry/opentelemetry-js-api/issues/36
        attributes: toProtoSpanAttributes(sdkLink.attributes ?? {}),
        droppedAttributesCount: 0,
    };
}

export function toProtoStatus(sdkSpanStatus: api.SpanStatus): proto.Status {
    return {
        deprecatedCode: proto.Status_DeprecatedStatusCode.UNRECOGNIZED,
        message: sdkSpanStatus.message,
        code: spanStatusCodeToProtoMap.get(sdkSpanStatus.code),
    };
}

export function toProtoSpan(sdkSpan: tracing.ReadableSpan): proto.Span {
    return {
        traceId: hexToBytesArray(sdkSpan.spanContext.traceId),
        spanId: hexToBytesArray(sdkSpan.spanContext.spanId),
        traceState: toProtoTraceState(sdkSpan.spanContext.traceState),
        parentSpanId: sdkSpan.parentSpanId ? hexToBytesArray(sdkSpan.parentSpanId) : undefined,
        name: sdkSpan.name,
        kind: spanKindToProtoMap.get(sdkSpan.kind) ?? proto.Span_SpanKind.SPAN_KIND_UNSPECIFIED,
        startTimeUnixNano: core.hrTimeToNanoseconds(sdkSpan.startTime),
        endTimeUnixNano: core.hrTimeToNanoseconds(sdkSpan.endTime),
        attributes: toProtoSpanAttributes(sdkSpan.attributes),
        droppedAttributesCount: 0,
        events: sdkSpan.events.map(toProtoSpanEvent),
        droppedEventsCount: 0,
        links: sdkSpan.links.map(toProtoSpanLink),
        droppedLinksCount: 0,
        status: toProtoStatus(sdkSpan.status),
    };
}

export function toProtoInstrumentationLibrarySpans(
    sdkInstrumentationLibrary: core.InstrumentationLibrary,
    sdkSpans: tracing.ReadableSpan[]
): proto.InstrumentationLibrarySpans {
    return {
        instrumentationLibrary: toInstrumentationLibrary(sdkInstrumentationLibrary),
        spans: sdkSpans.map((sdkSpan) => toProtoSpan(sdkSpan)),
    };
}

export function toProtoResourceSpans(
    sdkResource: resources.Resource,
    sdkResourceSpans: tracing.ReadableSpan[], 
    additionalAttributes: resources.ResourceAttributes = {}
): proto.ResourceSpans {
    const spansByInstrumentationLibrary = groupSpansByInstrumentationLibrary(sdkResourceSpans);
    return {
        resource: toResource(sdkResource, additionalAttributes),
        instrumentationLibrarySpans: Array.from(spansByInstrumentationLibrary).map(
            ([sdkInstrumentationLibrary, sdkInstrumentationLibrarySpans]) => {
                return toProtoInstrumentationLibrarySpans(sdkInstrumentationLibrary, sdkInstrumentationLibrarySpans);
            }
        ),
    };
}

export function toProtoResourceSpansArray(sdkSpans: tracing.ReadableSpan[], additionalAttributes: resources.ResourceAttributes = {}): proto.ResourceSpans[] {
    const spansByResource = groupSpansByResource(sdkSpans);
    return Array.from(spansByResource).map(([sdkResource, sdkResourceSpans]) =>
        toProtoResourceSpans(sdkResource, sdkResourceSpans, additionalAttributes)
    );
}
