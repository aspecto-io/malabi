import { getJaegerSpans } from '../exporter/jaeger';
import { InstrumentationConfig, StorageBackend } from '../instrumentation';
import { getInMemorySpans, resetInMemorySpans } from '../exporter';
import { collectorTraceV1Transform } from 'opentelemetry-proto-transformations';

export const getMalabiExpressRouter = ({ serviceName, storageBackend }: InstrumentationConfig) => {
    const express = require('express');
    return express
        .Router()
        .get('/spans', async (_req, res) => {
            res.set('Content-Type', 'application/json');
            res.send(
                storageBackend === StorageBackend.Jaeger ? await getJaegerSpans(serviceName) :
                collectorTraceV1Transform.toJsonEncodedProtobufFormat(
                    collectorTraceV1Transform.toProtoExportTraceServiceRequest(getInMemorySpans())
                )
            );
        })
        .delete('/spans', async (_req, res) => res.json(resetInMemorySpans()));
};

export const serveMalabiFromHttpApp = (port: number, instrumentationConfig: InstrumentationConfig) => {
    const express = require('express');
    const app = express();
    app.use('/malabi', getMalabiExpressRouter(instrumentationConfig));
    app.listen(port);
    return app;
};
