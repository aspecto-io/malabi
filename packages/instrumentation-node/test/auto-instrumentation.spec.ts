import 'mocha';
import expect from 'expect';
import { memoryExporter, registerAutoInstrumentationsForTests } from './instrument';

registerAutoInstrumentationsForTests({});
import axios from 'axios';
import { HttpExtendedAttribute } from '../src';

describe('auto-instrumentation', () => {
    describe('http', () => {
        it('outgoing http', async () => {
            await axios.get('https://jsonplaceholder.typicode.com/todos/1');
            const outgoingHttpSpan = memoryExporter.getFinishedSpans()[0];
            expect(outgoingHttpSpan).toBeDefined();
            expect(outgoingHttpSpan.instrumentationLibrary.name).toBe('@opentelemetry/instrumentation-http');

            expect(outgoingHttpSpan.attributes[HttpExtendedAttribute.HTTP_PATH]).toBe('/todos/1');

            const requestHeaders = JSON.parse(
                outgoingHttpSpan.attributes[HttpExtendedAttribute.HTTP_REQUEST_HEADERS] as string
            );
            expect(requestHeaders['traceparent']).toMatch(/^[0-9a-f]{2}-[0-9a-f]{32}-[0-9a-f]{16}-[0-9a-f]{2}$/i);

            const responseHeaders = JSON.parse(
                outgoingHttpSpan.attributes[HttpExtendedAttribute.HTTP_RESPONSE_HEADERS] as string
            );
            expect(responseHeaders).toBeDefined();

            // we do not collect payloads
            expect(outgoingHttpSpan.attributes[HttpExtendedAttribute.HTTP_REQUEST_BODY]).toBeUndefined();
            expect(outgoingHttpSpan.attributes[HttpExtendedAttribute.HTTP_RESPONSE_BODY]).toBeUndefined();
        });
    });
});
