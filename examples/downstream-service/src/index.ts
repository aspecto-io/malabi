import * as malabi from 'malabi';
malabi.instrument();
malabi.serveMalabiFromHttpApp(18394);

import express from 'express';
import body from "body-parser";
import * as aws from 'aws-sdk';
const s3 = new aws.S3();
const PORT = process.env.PORT || 8081;

const app = express();
app.use(body.json())
app.listen(PORT, () => console.log(`downstream-service started at port ${PORT}`));

app.get('/', (req, res) => { res.sendStatus(200) })

app.get('/data', async (req, res) => {
    const params = { Bucket: 'malabi-test-bucket', Key: 'some-random-key', Body: 'some-random-content' };
    await s3.putObject(params).promise()
    res.json({ status: 'good' })
})