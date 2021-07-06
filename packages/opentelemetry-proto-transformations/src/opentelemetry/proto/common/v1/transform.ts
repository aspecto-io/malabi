import * as core from '@opentelemetry/core';
import * as api from '@opentelemetry/api';

import * as proto from './common';

const MAX_INTEGER_VALUE = 2147483647;
const MIN_INTEGER_VALUE = -2147483648;

export type protoAnyValueType =
    | string
    | number
    | boolean
    | Array<null | undefined | string>
    | Array<null | undefined | number>
    | Array<null | undefined | boolean>;

export function toProtoArrayValue(values: protoAnyValueType[]): proto.ArrayValue {
    return {
        values: values.map(toProtoAnyValue),
    };
}

export function fromProtoArrayValue(protoArrayValue: proto.ArrayValue): protoAnyValueType {
    return protoArrayValue.values.map(fromProtoAnyValue) as protoAnyValueType;
}

export function toProtoAnyValue(sdkValue: protoAnyValueType): proto.AnyValue {
    switch (typeof sdkValue) {
        case 'string':
            // @ts-ignore
            return {
                stringValue: sdkValue,
            };

        case 'boolean':
            // @ts-ignore
            return {
                boolValue: sdkValue,
            };

        case 'number': {
            if (Number.isInteger(sdkValue) && sdkValue <= MAX_INTEGER_VALUE && sdkValue >= MIN_INTEGER_VALUE) {
                // @ts-ignore
                return {
                    intValue: sdkValue,
                };
            } else {
                // @ts-ignore
                return {
                    doubleValue: sdkValue,
                };
            }
        }
    }

    if (Array.isArray(sdkValue)) {
        // @ts-ignore
        return {
            arrayValue: toProtoArrayValue(sdkValue),
        };
    }

    // @ts-ignore
    return {};
}

export function fromProtoAnyValue(protoAnyValue: proto.AnyValue): protoAnyValueType {
    if (protoAnyValue.stringValue) {
        return protoAnyValue.stringValue;
    } else if (protoAnyValue.boolValue) {
        return protoAnyValue.boolValue;
    } else if (protoAnyValue.intValue) {
        return protoAnyValue.intValue;
    } else if (protoAnyValue.doubleValue) {
        return protoAnyValue.doubleValue;
    } else if (protoAnyValue.arrayValue) {
        return fromProtoArrayValue(protoAnyValue.arrayValue);
    }
}

export function toProtoKeyValue(
    k: string,
    v:
        | string
        | number
        | boolean
        | Array<null | undefined | string>
        | Array<null | undefined | number>
        | Array<null | undefined | boolean>
): proto.KeyValue {
    return {
        key: k,
        value: toProtoAnyValue(v),
    };
}

export function fromProtoKeyValue(
    protoKeyValue: proto.KeyValue
): [
    k: string,
    v:
        | string
        | number
        | boolean
        | Array<null | undefined | string>
        | Array<null | undefined | number>
        | Array<null | undefined | boolean>
] {
    return [protoKeyValue.key, fromProtoAnyValue(protoKeyValue.value)];
}

export function toProtoSpanAttributes(sdkSpanAttributes: api.SpanAttributes): proto.KeyValue[] {
    return Object.entries(sdkSpanAttributes).map(
        ([sdkAttributeKey, sdkAttributeValue]: [any, api.SpanAttributeValue]) =>
            toProtoKeyValue(sdkAttributeKey, sdkAttributeValue)
    );
}

export function fromProtoSpanAttributes(protoSpanAttributes: proto.KeyValue[]): api.SpanAttributes {
    return Object.fromEntries(protoSpanAttributes.map(fromProtoKeyValue));
}

export function toInstrumentationLibrary(
    sdkInstrumentationLibrary: core.InstrumentationLibrary
): proto.InstrumentationLibrary {
    return {
        name: sdkInstrumentationLibrary.name,
        version: sdkInstrumentationLibrary.version,
    };
}

export function fromInstrumentationLibrary(
    protoInstrumentationLibrary: proto.InstrumentationLibrary
): core.InstrumentationLibrary {
    return {
        name: protoInstrumentationLibrary.name,
        version: protoInstrumentationLibrary.version,
    };
}
