import { Span } from '@opentelemetry/api';
import { callHookOnlyOnRecordingSpan } from '../payload-collection/recording-span';
import { KafkaJsInstrumentationConfig } from 'opentelemetry-instrumentation-kafkajs';
import { GeneralExtendedAttribute, MessagingExtendedAttribute } from '../enums';
import { AutoInstrumentationOptions } from '../types';

export interface KafkaJsMessage {
    value: Buffer | string | null;
}

const addPayloadHook = (span: Span, _topic: string, message: KafkaJsMessage) => {
    if (message.value !== null && message.value !== undefined) {
        span.setAttribute(MessagingExtendedAttribute.MESSAGING_PAYLOAD, message.value.toString());
    }
};

export const kafkaJsInstrumentationConfig = (options: AutoInstrumentationOptions): KafkaJsInstrumentationConfig => ({
    producerHook: options.collectPayloads && callHookOnlyOnRecordingSpan(addPayloadHook),
    consumerHook: options.collectPayloads && callHookOnlyOnRecordingSpan(addPayloadHook),
    moduleVersionAttributeName: GeneralExtendedAttribute.INSTRUMENTED_LIBRARY_VERSION,
});
