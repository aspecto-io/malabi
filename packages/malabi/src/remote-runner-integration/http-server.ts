import { getSpans, resetSpans } from '../exporter';
import {
    toJsonEncodedProtobufFormat,
    toProtoExportTraceServiceRequest,
} from 'opentelemetry-proto-transformations/src/opentelemetry/proto/collector/trace/v1/transform';
import * as fs from 'fs';

const getPackageName = () => {
    try {
        return JSON.parse(fs.readFileSync('package.json').toString())?.name;
    } catch (err) {
        return null;
    }
};

export const getMalabiExpressRouter = () => {
    const express = require('express');
    return express
        .Router()
        .get('/spans', (req, res) => {
            res.set('Content-Type', 'application/json');
            res.send(toJsonEncodedProtobufFormat(toProtoExportTraceServiceRequest(getSpans())));
        })
        .delete('/spans', (req, res) => res.json(resetSpans()));
};

export const serveMalabiFromHttpApp = (port: number) => {
    const express = require('express');
    const app = express();
    app.use('/malabi', getMalabiExpressRouter());
    app.listen(port);
    return app;
};
