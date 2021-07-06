/* eslint-disable */
import Long from 'long';
import _m0 from 'protobufjs/minimal';

export const protobufPackage = 'opentelemetry.proto.common.v1';

/**
 * AnyValue is used to represent any type of attribute value. AnyValue may contain a
 * primitive value such as a string or integer or it may contain an arbitrary nested
 * object containing arrays, key-value lists and primitives.
 */
export interface AnyValue {
    stringValue: string | undefined;
    boolValue: boolean | undefined;
    intValue: number | undefined;
    doubleValue: number | undefined;
    arrayValue: ArrayValue | undefined;
    kvlistValue: KeyValueList | undefined;
}

/**
 * ArrayValue is a list of AnyValue messages. We need ArrayValue as a message
 * since oneof in AnyValue does not allow repeated fields.
 */
export interface ArrayValue {
    /** Array of values. The array may be empty (contain 0 elements). */
    values: AnyValue[];
}

/**
 * KeyValueList is a list of KeyValue messages. We need KeyValueList as a message
 * since `oneof` in AnyValue does not allow repeated fields. Everywhere else where we need
 * a list of KeyValue messages (e.g. in Span) we use `repeated KeyValue` directly to
 * avoid unnecessary extra wrapping (which slows down the protocol). The 2 approaches
 * are semantically equivalent.
 */
export interface KeyValueList {
    /**
     * A collection of key/value pairs of key-value pairs. The list may be empty (may
     * contain 0 elements).
     */
    values: KeyValue[];
}

/**
 * KeyValue is a key-value pair that is used to store Span attributes, Link
 * attributes, etc.
 */
export interface KeyValue {
    key: string;
    value: AnyValue | undefined;
}

/**
 * StringKeyValue is a pair of key/value strings. This is the simpler (and faster) version
 * of KeyValue that only supports string values.
 */
export interface StringKeyValue {
    key: string;
    value: string;
}

/**
 * InstrumentationLibrary is a message representing the instrumentation library information
 * such as the fully qualified name and version.
 */
export interface InstrumentationLibrary {
    /** An empty instrumentation library name means the name is unknown. */
    name: string;
    version: string;
}

const baseAnyValue: object = {};

export const AnyValue = {
    encode(message: AnyValue, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
        if (message.stringValue !== undefined) {
            writer.uint32(10).string(message.stringValue);
        }
        if (message.boolValue !== undefined) {
            writer.uint32(16).bool(message.boolValue);
        }
        if (message.intValue !== undefined) {
            writer.uint32(24).int64(message.intValue);
        }
        if (message.doubleValue !== undefined) {
            writer.uint32(33).double(message.doubleValue);
        }
        if (message.arrayValue !== undefined) {
            ArrayValue.encode(message.arrayValue, writer.uint32(42).fork()).ldelim();
        }
        if (message.kvlistValue !== undefined) {
            KeyValueList.encode(message.kvlistValue, writer.uint32(50).fork()).ldelim();
        }
        return writer;
    },

    decode(input: _m0.Reader | Uint8Array, length?: number): AnyValue {
        const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = { ...baseAnyValue } as AnyValue;
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.stringValue = reader.string();
                    break;
                case 2:
                    message.boolValue = reader.bool();
                    break;
                case 3:
                    message.intValue = longToNumber(reader.int64() as Long);
                    break;
                case 4:
                    message.doubleValue = reader.double();
                    break;
                case 5:
                    message.arrayValue = ArrayValue.decode(reader, reader.uint32());
                    break;
                case 6:
                    message.kvlistValue = KeyValueList.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },

    fromJSON(object: any): AnyValue {
        const message = { ...baseAnyValue } as AnyValue;
        if (object.stringValue !== undefined && object.stringValue !== null) {
            message.stringValue = String(object.stringValue);
        } else {
            message.stringValue = undefined;
        }
        if (object.boolValue !== undefined && object.boolValue !== null) {
            message.boolValue = Boolean(object.boolValue);
        } else {
            message.boolValue = undefined;
        }
        if (object.intValue !== undefined && object.intValue !== null) {
            message.intValue = Number(object.intValue);
        } else {
            message.intValue = undefined;
        }
        if (object.doubleValue !== undefined && object.doubleValue !== null) {
            message.doubleValue = Number(object.doubleValue);
        } else {
            message.doubleValue = undefined;
        }
        if (object.arrayValue !== undefined && object.arrayValue !== null) {
            message.arrayValue = ArrayValue.fromJSON(object.arrayValue);
        } else {
            message.arrayValue = undefined;
        }
        if (object.kvlistValue !== undefined && object.kvlistValue !== null) {
            message.kvlistValue = KeyValueList.fromJSON(object.kvlistValue);
        } else {
            message.kvlistValue = undefined;
        }
        return message;
    },

    toJSON(message: AnyValue): unknown {
        const obj: any = {};
        message.stringValue !== undefined && (obj.stringValue = message.stringValue);
        message.boolValue !== undefined && (obj.boolValue = message.boolValue);
        message.intValue !== undefined && (obj.intValue = message.intValue);
        message.doubleValue !== undefined && (obj.doubleValue = message.doubleValue);
        message.arrayValue !== undefined &&
            (obj.arrayValue = message.arrayValue ? ArrayValue.toJSON(message.arrayValue) : undefined);
        message.kvlistValue !== undefined &&
            (obj.kvlistValue = message.kvlistValue ? KeyValueList.toJSON(message.kvlistValue) : undefined);
        return obj;
    },

    fromPartial(object: DeepPartial<AnyValue>): AnyValue {
        const message = { ...baseAnyValue } as AnyValue;
        if (object.stringValue !== undefined && object.stringValue !== null) {
            message.stringValue = object.stringValue;
        } else {
            message.stringValue = undefined;
        }
        if (object.boolValue !== undefined && object.boolValue !== null) {
            message.boolValue = object.boolValue;
        } else {
            message.boolValue = undefined;
        }
        if (object.intValue !== undefined && object.intValue !== null) {
            message.intValue = object.intValue;
        } else {
            message.intValue = undefined;
        }
        if (object.doubleValue !== undefined && object.doubleValue !== null) {
            message.doubleValue = object.doubleValue;
        } else {
            message.doubleValue = undefined;
        }
        if (object.arrayValue !== undefined && object.arrayValue !== null) {
            message.arrayValue = ArrayValue.fromPartial(object.arrayValue);
        } else {
            message.arrayValue = undefined;
        }
        if (object.kvlistValue !== undefined && object.kvlistValue !== null) {
            message.kvlistValue = KeyValueList.fromPartial(object.kvlistValue);
        } else {
            message.kvlistValue = undefined;
        }
        return message;
    },
};

const baseArrayValue: object = {};

export const ArrayValue = {
    encode(message: ArrayValue, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
        for (const v of message.values) {
            AnyValue.encode(v!, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },

    decode(input: _m0.Reader | Uint8Array, length?: number): ArrayValue {
        const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = { ...baseArrayValue } as ArrayValue;
        message.values = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.values.push(AnyValue.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },

    fromJSON(object: any): ArrayValue {
        const message = { ...baseArrayValue } as ArrayValue;
        message.values = [];
        if (object.values !== undefined && object.values !== null) {
            for (const e of object.values) {
                message.values.push(AnyValue.fromJSON(e));
            }
        }
        return message;
    },

    toJSON(message: ArrayValue): unknown {
        const obj: any = {};
        if (message.values) {
            obj.values = message.values.map((e) => (e ? AnyValue.toJSON(e) : undefined));
        } else {
            obj.values = [];
        }
        return obj;
    },

    fromPartial(object: DeepPartial<ArrayValue>): ArrayValue {
        const message = { ...baseArrayValue } as ArrayValue;
        message.values = [];
        if (object.values !== undefined && object.values !== null) {
            for (const e of object.values) {
                message.values.push(AnyValue.fromPartial(e));
            }
        }
        return message;
    },
};

const baseKeyValueList: object = {};

export const KeyValueList = {
    encode(message: KeyValueList, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
        for (const v of message.values) {
            KeyValue.encode(v!, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },

    decode(input: _m0.Reader | Uint8Array, length?: number): KeyValueList {
        const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = { ...baseKeyValueList } as KeyValueList;
        message.values = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.values.push(KeyValue.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },

    fromJSON(object: any): KeyValueList {
        const message = { ...baseKeyValueList } as KeyValueList;
        message.values = [];
        if (object.values !== undefined && object.values !== null) {
            for (const e of object.values) {
                message.values.push(KeyValue.fromJSON(e));
            }
        }
        return message;
    },

    toJSON(message: KeyValueList): unknown {
        const obj: any = {};
        if (message.values) {
            obj.values = message.values.map((e) => (e ? KeyValue.toJSON(e) : undefined));
        } else {
            obj.values = [];
        }
        return obj;
    },

    fromPartial(object: DeepPartial<KeyValueList>): KeyValueList {
        const message = { ...baseKeyValueList } as KeyValueList;
        message.values = [];
        if (object.values !== undefined && object.values !== null) {
            for (const e of object.values) {
                message.values.push(KeyValue.fromPartial(e));
            }
        }
        return message;
    },
};

const baseKeyValue: object = { key: '' };

export const KeyValue = {
    encode(message: KeyValue, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
        if (message.key !== '') {
            writer.uint32(10).string(message.key);
        }
        if (message.value !== undefined) {
            AnyValue.encode(message.value, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },

    decode(input: _m0.Reader | Uint8Array, length?: number): KeyValue {
        const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = { ...baseKeyValue } as KeyValue;
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.key = reader.string();
                    break;
                case 2:
                    message.value = AnyValue.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },

    fromJSON(object: any): KeyValue {
        const message = { ...baseKeyValue } as KeyValue;
        if (object.key !== undefined && object.key !== null) {
            message.key = String(object.key);
        } else {
            message.key = '';
        }
        if (object.value !== undefined && object.value !== null) {
            message.value = AnyValue.fromJSON(object.value);
        } else {
            message.value = undefined;
        }
        return message;
    },

    toJSON(message: KeyValue): unknown {
        const obj: any = {};
        message.key !== undefined && (obj.key = message.key);
        message.value !== undefined && (obj.value = message.value ? AnyValue.toJSON(message.value) : undefined);
        return obj;
    },

    fromPartial(object: DeepPartial<KeyValue>): KeyValue {
        const message = { ...baseKeyValue } as KeyValue;
        if (object.key !== undefined && object.key !== null) {
            message.key = object.key;
        } else {
            message.key = '';
        }
        if (object.value !== undefined && object.value !== null) {
            message.value = AnyValue.fromPartial(object.value);
        } else {
            message.value = undefined;
        }
        return message;
    },
};

const baseStringKeyValue: object = { key: '', value: '' };

export const StringKeyValue = {
    encode(message: StringKeyValue, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
        if (message.key !== '') {
            writer.uint32(10).string(message.key);
        }
        if (message.value !== '') {
            writer.uint32(18).string(message.value);
        }
        return writer;
    },

    decode(input: _m0.Reader | Uint8Array, length?: number): StringKeyValue {
        const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = { ...baseStringKeyValue } as StringKeyValue;
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.key = reader.string();
                    break;
                case 2:
                    message.value = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },

    fromJSON(object: any): StringKeyValue {
        const message = { ...baseStringKeyValue } as StringKeyValue;
        if (object.key !== undefined && object.key !== null) {
            message.key = String(object.key);
        } else {
            message.key = '';
        }
        if (object.value !== undefined && object.value !== null) {
            message.value = String(object.value);
        } else {
            message.value = '';
        }
        return message;
    },

    toJSON(message: StringKeyValue): unknown {
        const obj: any = {};
        message.key !== undefined && (obj.key = message.key);
        message.value !== undefined && (obj.value = message.value);
        return obj;
    },

    fromPartial(object: DeepPartial<StringKeyValue>): StringKeyValue {
        const message = { ...baseStringKeyValue } as StringKeyValue;
        if (object.key !== undefined && object.key !== null) {
            message.key = object.key;
        } else {
            message.key = '';
        }
        if (object.value !== undefined && object.value !== null) {
            message.value = object.value;
        } else {
            message.value = '';
        }
        return message;
    },
};

const baseInstrumentationLibrary: object = { name: '', version: '' };

export const InstrumentationLibrary = {
    encode(message: InstrumentationLibrary, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
        if (message.name !== '') {
            writer.uint32(10).string(message.name);
        }
        if (message.version !== '') {
            writer.uint32(18).string(message.version);
        }
        return writer;
    },

    decode(input: _m0.Reader | Uint8Array, length?: number): InstrumentationLibrary {
        const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = { ...baseInstrumentationLibrary } as InstrumentationLibrary;
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.name = reader.string();
                    break;
                case 2:
                    message.version = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },

    fromJSON(object: any): InstrumentationLibrary {
        const message = { ...baseInstrumentationLibrary } as InstrumentationLibrary;
        if (object.name !== undefined && object.name !== null) {
            message.name = String(object.name);
        } else {
            message.name = '';
        }
        if (object.version !== undefined && object.version !== null) {
            message.version = String(object.version);
        } else {
            message.version = '';
        }
        return message;
    },

    toJSON(message: InstrumentationLibrary): unknown {
        const obj: any = {};
        message.name !== undefined && (obj.name = message.name);
        message.version !== undefined && (obj.version = message.version);
        return obj;
    },

    fromPartial(object: DeepPartial<InstrumentationLibrary>): InstrumentationLibrary {
        const message = { ...baseInstrumentationLibrary } as InstrumentationLibrary;
        if (object.name !== undefined && object.name !== null) {
            message.name = object.name;
        } else {
            message.name = '';
        }
        if (object.version !== undefined && object.version !== null) {
            message.version = object.version;
        } else {
            message.version = '';
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
