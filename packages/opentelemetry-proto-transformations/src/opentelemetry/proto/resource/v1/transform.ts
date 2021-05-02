import * as resources from '@opentelemetry/resources';
import { toKeyValue } from '../../common/v1/transform';

import { Resource as ProtoResource } from './resource';

export function toResource(sdkResource: resources.Resource, additionalAttributes: resources.ResourceAttributes = {}): ProtoResource {
    const attrs: resources.ResourceAttributes = Object.assign({}, sdkResource.attributes, additionalAttributes);
    return {
        attributes: Object.entries(attrs).map( ([k, v]) => {
            return toKeyValue(k, v);
        }),
        droppedAttributesCount: 0,
    };
}
