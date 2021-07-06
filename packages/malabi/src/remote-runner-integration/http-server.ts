import { getSpans, resetSpans } from '../exporter';
import { collectorTraceV1Transform } from 'opentelemetry-proto-transformations';

export const getMalabiExpressRouter = () => {
    const express = require('express');
    return express
        .Router()
        .get('/spans', (_req, res) => {
            res.set('Content-Type', 'application/json');
            res.send(
                collectorTraceV1Transform.toJsonEncodedProtobufFormat(
                    collectorTraceV1Transform.toProtoExportTraceServiceRequest(getSpans())
                )
            );
        })
        .delete('/spans', (_req, res) => res.json(resetSpans()));
};

export const serveMalabiFromHttpApp = (port: number) => {
    const express = require('express');
    const app = express();
    app.use('/malabi', getMalabiExpressRouter());
    app.listen(port);
    return app;
};
