import { getJaegerSpans } from '../exporter/jaeger';
import { InstrumentationConfig, StorageBackend } from '../instrumentation';
import { getInMemorySpans } from '../exporter';
import { collectorTraceV1Transform } from 'opentelemetry-proto-transformations';

export const getMalabiExpressRouter = ({ serviceName }: InstrumentationConfig) => {
    const express = require('express');
    return express
        .Router()
        .get('/spans', async (_req, res) => {
            res.set('Content-Type', 'application/json');
            res.send(
                process.env.MALABI_STORAGE_BACKEND === StorageBackend.Jaeger ? await getJaegerSpans(serviceName) :
                collectorTraceV1Transform.toJsonEncodedProtobufFormat(
                    collectorTraceV1Transform.toProtoExportTraceServiceRequest(getInMemorySpans())
                )
            );
        })
};

export const serveMalabiFromHttpApp = (port: number, instrumentationConfig: InstrumentationConfig) => {
    const express = require('express');
    const app = express();
    app.use('/malabi', getMalabiExpressRouter(instrumentationConfig));
    app.listen(port);
    return app;
};
