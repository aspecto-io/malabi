import * as tracing from '@opentelemetry/sdk-trace-base';
import * as resources from '@opentelemetry/resources';
import * as core from '@opentelemetry/core';
import * as api from '@opentelemetry/api';

import * as proto from './trace';
import { fromProtoResource, toProtoResource } from '../../resource/v1/transform';
import {
    fromInstrumentationLibrary,
    fromProtoSpanAttributes,
    toInstrumentationLibrary,
    toProtoKeyValue,
    toProtoSpanAttributes,
} from '../../common/v1/transform';
import { bytesArrayToHex, hexToBytesArray, nanosecondsToHrTime } from '../../../../utils';
import { hrTimeDuration } from '@opentelemetry/core';

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

export const spanKindToProtoMap = new Map<api.SpanKind, proto.Span_SpanKind>([
    [api.SpanKind.INTERNAL, proto.Span_SpanKind.SPAN_KIND_INTERNAL],
    [api.SpanKind.SERVER, proto.Span_SpanKind.SPAN_KIND_SERVER],
    [api.SpanKind.CLIENT, proto.Span_SpanKind.SPAN_KIND_CLIENT],
    [api.SpanKind.PRODUCER, proto.Span_SpanKind.SPAN_KIND_PRODUCER],
    [api.SpanKind.CONSUMER, proto.Span_SpanKind.SPAN_KIND_CONSUMER],
]);

export const spanKindFromProtoMap = new Map<proto.Span_SpanKind, api.SpanKind>([
    [proto.Span_SpanKind.SPAN_KIND_INTERNAL, api.SpanKind.INTERNAL],
    [proto.Span_SpanKind.SPAN_KIND_SERVER, api.SpanKind.SERVER],
    [proto.Span_SpanKind.SPAN_KIND_CLIENT, api.SpanKind.CLIENT],
    [proto.Span_SpanKind.SPAN_KIND_PRODUCER, api.SpanKind.PRODUCER],
    [proto.Span_SpanKind.SPAN_KIND_CONSUMER, api.SpanKind.CONSUMER],
]);

export const spanStatusCodeToProtoMap = new Map<api.SpanStatusCode, proto.Status_StatusCode>([
    [api.SpanStatusCode.UNSET, proto.Status_StatusCode.STATUS_CODE_UNSET],
    [api.SpanStatusCode.OK, proto.Status_StatusCode.STATUS_CODE_OK],
    [api.SpanStatusCode.ERROR, proto.Status_StatusCode.STATUS_CODE_ERROR],
]);

export const spanStatusCodeFromProtoMap = new Map<proto.Status_StatusCode, api.SpanStatusCode>([
    [proto.Status_StatusCode.STATUS_CODE_UNSET, api.SpanStatusCode.UNSET],
    [proto.Status_StatusCode.STATUS_CODE_OK, api.SpanStatusCode.OK],
    [proto.Status_StatusCode.STATUS_CODE_ERROR, api.SpanStatusCode.ERROR],
]);

export function toProtoTraceState(sdkTraceState?: api.TraceState): string | undefined {
    if (!sdkTraceState) return undefined;
    return sdkTraceState.serialize();
}

export function fromProtoTraceState(protoTraceState: string): core.TraceState {
    if (!protoTraceState) return undefined;
    return new core.TraceState(protoTraceState);
}

export function toProtoSpanEvent(sdkSpanEvent: tracing.TimedEvent): proto.Span_Event {
    return {
        timeUnixNano: core.hrTimeToNanoseconds(sdkSpanEvent.time),
        name: sdkSpanEvent.name,
        attributes: toProtoSpanAttributes(sdkSpanEvent.attributes ?? {}),
        droppedAttributesCount: 0,
    };
}

export function fromProtoSpanEvent(protoSpanEvent: proto.Span_Event): tracing.TimedEvent {
    return {
        time: nanosecondsToHrTime(protoSpanEvent.timeUnixNano),
        name: protoSpanEvent.name,
        attributes: fromProtoSpanAttributes(protoSpanEvent.attributes),
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

export function fromProtoSpanLink(protoSpanLink: proto.Span_Link): api.Link {
    return {
        context: {
            traceId: bytesArrayToHex(protoSpanLink.traceId),
            spanId: bytesArrayToHex(protoSpanLink.spanId),
            traceFlags: 0,
        },
        attributes: fromProtoSpanAttributes(protoSpanLink.attributes),
    };
}

export function toProtoStatus(sdkSpanStatus: api.SpanStatus): proto.Status {
    return {
        deprecatedCode: proto.Status_DeprecatedStatusCode.UNRECOGNIZED,
        message: sdkSpanStatus.message,
        code: spanStatusCodeToProtoMap.get(sdkSpanStatus.code),
    };
}

export function fromProtoStatus(protoStatus: proto.Status): api.SpanStatus {
    return {
        code: spanStatusCodeFromProtoMap.get(protoStatus.code),
        message: protoStatus.message,
    };
}

export function toProtoSpan(sdkSpan: tracing.ReadableSpan): proto.Span {
    return {
        traceId: hexToBytesArray(sdkSpan.spanContext().traceId),
        spanId: hexToBytesArray(sdkSpan.spanContext().spanId),
        traceState: toProtoTraceState(sdkSpan.spanContext().traceState),
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

export function fromProtoSpan(
    protoSpan: proto.Span,
    sdkResource: resources.Resource,
    sdkInstrumentationLibrary: core.InstrumentationLibrary
): tracing.ReadableSpan {
    const startTime = nanosecondsToHrTime(protoSpan.startTimeUnixNano);
    const endTime = nanosecondsToHrTime(protoSpan.endTimeUnixNano);
    return {
        name: protoSpan.name,
        kind: spanKindFromProtoMap.get(protoSpan.kind),
        spanContext: () => ({
            traceId: bytesArrayToHex(protoSpan.traceId),
            spanId: bytesArrayToHex(protoSpan.spanId),
            traceFlags: 0, // we can't actually tell if the trace was sampled since this data is not in the protobuf spec
            traceState: fromProtoTraceState(protoSpan.traceState),
        }),
        parentSpanId: protoSpan.parentSpanId ? bytesArrayToHex(protoSpan.parentSpanId) : undefined,
        startTime,
        endTime,
        status: fromProtoStatus(protoSpan.status),
        attributes: fromProtoSpanAttributes(protoSpan.attributes),
        links: protoSpan.links.map(fromProtoSpanLink),
        events: protoSpan.events.map(fromProtoSpanEvent),
        duration: hrTimeDuration(startTime, endTime),
        ended: true,
        resource: sdkResource,
        instrumentationLibrary: sdkInstrumentationLibrary,
        droppedAttributesCount: 0,
        droppedEventsCount:0,
        droppedLinksCount: 0,
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

export function fromProtoInstrumentationLibrarySpans(
    protoInstrumentationLibrarySpans: proto.InstrumentationLibrarySpans,
    sdkResource: resources.Resource
): tracing.ReadableSpan[] {
    const sdkInstrumentationLibrary = fromInstrumentationLibrary(
        protoInstrumentationLibrarySpans.instrumentationLibrary
    );
    return protoInstrumentationLibrarySpans.spans.map((protoSpan) =>
        fromProtoSpan(protoSpan, sdkResource, sdkInstrumentationLibrary)
    );
}

export function toProtoResourceSpans(
    sdkResource: resources.Resource,
    sdkResourceSpans: tracing.ReadableSpan[],
    additionalAttributes: resources.ResourceAttributes = {}
): proto.ResourceSpans {
    const spansByInstrumentationLibrary = groupSpansByInstrumentationLibrary(sdkResourceSpans);
    return {
        resource: toProtoResource(sdkResource, additionalAttributes),
        instrumentationLibrarySpans: Array.from(spansByInstrumentationLibrary).map(
            ([sdkInstrumentationLibrary, sdkInstrumentationLibrarySpans]) => {
                return toProtoInstrumentationLibrarySpans(sdkInstrumentationLibrary, sdkInstrumentationLibrarySpans);
            }
        ),
    };
}

export function fromProtoResourceSpans(protoResourceSpans: proto.ResourceSpans): tracing.ReadableSpan[] {
    const sdkResource = fromProtoResource(protoResourceSpans.resource);
    return protoResourceSpans.instrumentationLibrarySpans.flatMap((instrumentationLibrarySpans) =>
        fromProtoInstrumentationLibrarySpans(instrumentationLibrarySpans, sdkResource)
    );
}

export function toProtoResourceSpansArray(
    sdkSpans: tracing.ReadableSpan[],
    additionalAttributes: resources.ResourceAttributes = {}
): proto.ResourceSpans[] {
    const spansByResource = groupSpansByResource(sdkSpans);
    return Array.from(spansByResource).map(([sdkResource, sdkResourceSpans]) =>
        toProtoResourceSpans(sdkResource, sdkResourceSpans, additionalAttributes)
    );
}

export function fromProtoResourceSpansArray(protoResourceSpansArray: proto.ResourceSpans[]): tracing.ReadableSpan[] {
    return protoResourceSpansArray.flatMap(fromProtoResourceSpans);
}
