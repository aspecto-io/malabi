import { getJaegerSpans } from '../exporter/jaeger';
import { InstrumentationConfig, StorageBackend } from '../instrumentation';
import { getInMemorySpans } from '../exporter';
import { collectorTraceV1Transform } from 'opentelemetry-proto-transformations';

export const getMalabiExpressRouter = ({ serviceName }: InstrumentationConfig) => {
    const express = require('express');
    return express
        .Router()
        .get('/spans', async (_req, res) => {
            const { query: { traceID } } = _req;
            if (!traceID) res.status(400).json({ message: 'Must provide a valid traceID' });
            res.set('Content-Type', 'application/json');
            const spans = collectorTraceV1Transform.toJsonEncodedProtobufFormat(
                collectorTraceV1Transform.toProtoExportTraceServiceRequest(process.env.MALABI_STORAGE_BACKEND === StorageBackend.Jaeger ?
                    await getJaegerSpans({ serviceName, traceID }) : getInMemorySpans({ traceID })));
            res.send(spans);
        })
};

export const serveMalabiFromHttpApp = (port: number, instrumentationConfig: InstrumentationConfig) => {
    const express = require('express');
    const app = express();
    app.use('/malabi', getMalabiExpressRouter(instrumentationConfig));
    app.listen(port);
    return app;
};
