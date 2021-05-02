import * as resources from '@opentelemetry/resources';
import { fromProtoKeyValue, toProtoKeyValue } from '../../common/v1/transform';
import * as proto from './resource';

export function toProtoResource(
    sdkResource: resources.Resource,
    additionalAttributes: resources.ResourceAttributes = {}
): proto.Resource {
    const attrs: resources.ResourceAttributes = Object.assign({}, sdkResource.attributes, additionalAttributes);
    return {
        attributes: Object.entries(attrs).map(([k, v]) => {
            return toProtoKeyValue(k, v);
        }),
        droppedAttributesCount: 0,
    };
}

export function fromProtoResource(protoResource: proto.Resource): resources.Resource {
    return new resources.Resource(
        Object.fromEntries(
            protoResource.attributes.map((kv) => {
                const [resourceAttributeKey, resourceAttributeValue] = fromProtoKeyValue(kv);
                return [resourceAttributeKey, resourceAttributeValue as number | string | boolean];
            })
        )
    );
}
