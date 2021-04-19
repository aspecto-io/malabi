import { Span } from '@opentelemetry/api';

export type InstrumentationHookFunction = (span: Span, ...args: any[]) => any;

export const callHookOnlyOnRecordingSpan = (hookFunction: InstrumentationHookFunction): InstrumentationHookFunction => {
    return (span: Span, ...args) => {
        if (!span.isRecording()) return;
        return hookFunction(span, ...args);
    };
};
