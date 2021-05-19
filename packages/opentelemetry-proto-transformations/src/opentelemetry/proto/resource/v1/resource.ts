/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import { KeyValue } from "../../../../opentelemetry/proto/common/v1/common";

export const protobufPackage = "opentelemetry.proto.resource.v1";

/** Resource information. */
export interface Resource {
  /** Set of labels that describe the resource. */
  attributes: KeyValue[];
  /**
   * dropped_attributes_count is the number of dropped attributes. If the value is 0, then
   * no attributes were dropped.
   */
  droppedAttributesCount: number;
}

const baseResource: object = { droppedAttributesCount: 0 };

export const Resource = {
  encode(
    message: Resource,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    for (const v of message.attributes) {
      KeyValue.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.droppedAttributesCount !== 0) {
      writer.uint32(16).uint32(message.droppedAttributesCount);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Resource {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseResource } as Resource;
    message.attributes = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.attributes.push(KeyValue.decode(reader, reader.uint32()));
          break;
        case 2:
          message.droppedAttributesCount = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Resource {
    const message = { ...baseResource } as Resource;
    message.attributes = [];
    if (object.attributes !== undefined && object.attributes !== null) {
      for (const e of object.attributes) {
        message.attributes.push(KeyValue.fromJSON(e));
      }
    }
    if (
      object.droppedAttributesCount !== undefined &&
      object.droppedAttributesCount !== null
    ) {
      message.droppedAttributesCount = Number(object.droppedAttributesCount);
    } else {
      message.droppedAttributesCount = 0;
    }
    return message;
  },

  toJSON(message: Resource): unknown {
    const obj: any = {};
    if (message.attributes) {
      obj.attributes = message.attributes.map((e) =>
        e ? KeyValue.toJSON(e) : undefined
      );
    } else {
      obj.attributes = [];
    }
    message.droppedAttributesCount !== undefined &&
      (obj.droppedAttributesCount = message.droppedAttributesCount);
    return obj;
  },

  fromPartial(object: DeepPartial<Resource>): Resource {
    const message = { ...baseResource } as Resource;
    message.attributes = [];
    if (object.attributes !== undefined && object.attributes !== null) {
      for (const e of object.attributes) {
        message.attributes.push(KeyValue.fromPartial(e));
      }
    }
    if (
      object.droppedAttributesCount !== undefined &&
      object.droppedAttributesCount !== null
    ) {
      message.droppedAttributesCount = object.droppedAttributesCount;
    } else {
      message.droppedAttributesCount = 0;
    }
    return message;
  },
};

type Builtin =
  | Date
  | Function
  | Uint8Array
  | string
  | number
  | boolean
  | undefined;
export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}
