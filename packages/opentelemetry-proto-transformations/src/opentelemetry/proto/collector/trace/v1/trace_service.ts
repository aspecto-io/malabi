/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import { ResourceSpans } from "../../../../../opentelemetry/proto/trace/v1/trace";

export const protobufPackage = "opentelemetry.proto.collector.trace.v1";

export interface ExportTraceServiceRequest {
  /**
   * An array of ResourceSpans.
   * For data coming from a single resource this array will typically contain one
   * element. Intermediary nodes (such as OpenTelemetry Collector) that receive
   * data from multiple origins typically batch the data before forwarding further and
   * in that case this array will contain multiple elements.
   */
  resourceSpans: ResourceSpans[];
}

export interface ExportTraceServiceResponse {}

const baseExportTraceServiceRequest: object = {};

export const ExportTraceServiceRequest = {
  encode(
    message: ExportTraceServiceRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    for (const v of message.resourceSpans) {
      ResourceSpans.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): ExportTraceServiceRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseExportTraceServiceRequest,
    } as ExportTraceServiceRequest;
    message.resourceSpans = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.resourceSpans.push(
            ResourceSpans.decode(reader, reader.uint32())
          );
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ExportTraceServiceRequest {
    const message = {
      ...baseExportTraceServiceRequest,
    } as ExportTraceServiceRequest;
    message.resourceSpans = [];
    if (object.resourceSpans !== undefined && object.resourceSpans !== null) {
      for (const e of object.resourceSpans) {
        message.resourceSpans.push(ResourceSpans.fromJSON(e));
      }
    }
    return message;
  },

  toJSON(message: ExportTraceServiceRequest): unknown {
    const obj: any = {};
    if (message.resourceSpans) {
      obj.resourceSpans = message.resourceSpans.map((e) =>
        e ? ResourceSpans.toJSON(e) : undefined
      );
    } else {
      obj.resourceSpans = [];
    }
    return obj;
  },

  fromPartial(
    object: DeepPartial<ExportTraceServiceRequest>
  ): ExportTraceServiceRequest {
    const message = {
      ...baseExportTraceServiceRequest,
    } as ExportTraceServiceRequest;
    message.resourceSpans = [];
    if (object.resourceSpans !== undefined && object.resourceSpans !== null) {
      for (const e of object.resourceSpans) {
        message.resourceSpans.push(ResourceSpans.fromPartial(e));
      }
    }
    return message;
  },
};

const baseExportTraceServiceResponse: object = {};

export const ExportTraceServiceResponse = {
  encode(
    _: ExportTraceServiceResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): ExportTraceServiceResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseExportTraceServiceResponse,
    } as ExportTraceServiceResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): ExportTraceServiceResponse {
    const message = {
      ...baseExportTraceServiceResponse,
    } as ExportTraceServiceResponse;
    return message;
  },

  toJSON(_: ExportTraceServiceResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(
    _: DeepPartial<ExportTraceServiceResponse>
  ): ExportTraceServiceResponse {
    const message = {
      ...baseExportTraceServiceResponse,
    } as ExportTraceServiceResponse;
    return message;
  },
};

/**
 * Service that can be used to push spans between one Application instrumented with
 * OpenTelemetry and an collector, or between an collector and a central collector (in this
 * case spans are sent/received to/from multiple Applications).
 */
export interface TraceService {
  /**
   * For performance reasons, it is recommended to keep this RPC
   * alive for the entire life of the application.
   */
  Export(
    request: ExportTraceServiceRequest
  ): Promise<ExportTraceServiceResponse>;
}

export class TraceServiceClientImpl implements TraceService {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
  }
  Export(
    request: ExportTraceServiceRequest
  ): Promise<ExportTraceServiceResponse> {
    const data = ExportTraceServiceRequest.encode(request).finish();
    const promise = this.rpc.request(
      "opentelemetry.proto.collector.trace.v1.TraceService",
      "Export",
      data
    );
    return promise.then((data) =>
      ExportTraceServiceResponse.decode(new _m0.Reader(data))
    );
  }
}

interface Rpc {
  request(
    service: string,
    method: string,
    data: Uint8Array
  ): Promise<Uint8Array>;
}

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
