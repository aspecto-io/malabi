import { getSpans, resetSpans } from "../exporter";
import { toCollectorExportTraceServiceRequest } from "./transform";
import * as fs from "fs";

const getPackageName = () => {
  try {
    return JSON.parse(fs.readFileSync("package.json").toString())?.name;
  } catch (err) {
    return null;
  }
};

const serviceName = getPackageName();

export const getMalabiExpressRouter = () => {
  const express = require("express");
  return express
    .Router()
    .get("/spans", (req, res) =>
      res.json(
        toCollectorExportTraceServiceRequest(getSpans(), serviceName, {}, true)
      )
    )
    .delete("/spans", (req, res) => res.json(resetSpans()));
};

export const serveMalabiFromHttpApp = (port: number) => {
  const express = require("express");
  const app = express();
  app.use("/malabi", getMalabiExpressRouter());
  app.listen(port);
  return app;
};
