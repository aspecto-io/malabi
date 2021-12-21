// var http = require('http');
// console.log('req.cache', require.cache);
const SERVICE_UNDER_TEST_PORT = process.env.PORT || 8080;
// import { fetchRemoteTelemetry, clearRemoteTelemetry, malabi, instrument } from 'malabi';
import { malabi } from 'malabi';

// instrument();


import { expect } from 'chai';
console.log('importing axios from service-under-test');
import axios from 'axios';
// const getTelemetryRepository = async () => await fetchRemoteTelemetry({ portOrBaseUrl: 18393 });

// import {
//     context,
//     // Context,
//     // Link,
//     // Sampler,
//     // SamplingDecision,
//     // SamplingResult,
//     // SpanAttributes,
//     // SpanKind,
//     trace,
// } from '@opentelemetry/api';
describe('testing service-under-test remotely', () => {

    it('successful /todo request', async () => {
        // get spans created from the previous call
        const telemetryRepo = await malabi( async () => {
            await axios(`http://localhost:${SERVICE_UNDER_TEST_PORT}/todo`);
        });

        // Validate internal HTTP call
        const todoInteralHTTPCall = telemetryRepo.spans.outgoing().first;
        expect(todoInteralHTTPCall.httpFullUrl).equals('https://jsonplaceholder.typicode.com/todos/1')
        expect(todoInteralHTTPCall.statusCode).equals(200);
    });

    it('successful /users request', async () => {
        // get spans created from the previous call
        const telemetryRepo = await malabi( async () => {
            // call to the service under test
            await axios.get(`http://localhost:${SERVICE_UNDER_TEST_PORT}/users`);
        });

        // Validating that /users had ran a single select statement and responded with an array.
        const sequelizeActivities = telemetryRepo.spans.sequelize();
        expect(sequelizeActivities.length).equals(1);
        expect(sequelizeActivities.first.dbOperation).equals("SELECT");
        expect(Array.isArray(JSON.parse(sequelizeActivities.first.dbResponse))).equals(true);
    });

    it('successful /users/Rick request', async () => {
        // get spans created from the previous call
        const telemetryRepo = await malabi( async () => {
            // call to the service under test
            await axios.get(`http://localhost:${SERVICE_UNDER_TEST_PORT}/users/Rick`);
        });

        const sequelizeActivities = telemetryRepo.spans.sequelize();
        expect(sequelizeActivities.length).equals(1);
        expect(sequelizeActivities.first.dbOperation).equals("SELECT");
        const dbResponse = JSON.parse(sequelizeActivities.first.dbResponse);
        expect(Array.isArray(dbResponse)).equals(true);
        expect(dbResponse.length).equals(1);
    });

    it('Non existing user - /users/Rick111 request', async () => {
        // get spans created from the previous call
        const telemetryRepo = await malabi( async () => {
            // call to the service under test
            await axios.get(`http://localhost:${SERVICE_UNDER_TEST_PORT}/users/Rick111`);

        });

        const sequelizeActivities =  telemetryRepo.spans.sequelize();
        expect(sequelizeActivities.length).equals(1);
        expect(sequelizeActivities.first.dbOperation).equals("SELECT");
        const dbResponse = JSON.parse(sequelizeActivities.first.dbResponse);
        expect(Array.isArray(dbResponse)).equals(true);
        expect(dbResponse.length).equals(0);
        expect(telemetryRepo.spans.httpGet().first.statusCode).equals(200);
    });

    // it('successful POST /users request', async () => {
    //     // call to the service under test
    //     const res = await axios.post(`http://localhost:${SERVICE_UNDER_TEST_PORT}/users`,{
    //         firstName:'Morty',
    //         lastName:'Smith',
    //     });
    //
    //     expect(res.status).toBe(200);
    //
    //     // get spans created from the previous call
    //     const telemetryRepo = await getTelemetryRepository();
    //
    //     // // Validating that /users created a new record in DB
    //     const sequelizeActivities =  telemetryRepo.spans.sequelize();
    //     expect(sequelizeActivities.length).toBe(1);
    //     expect(sequelizeActivities.first.dbOperation).toBe("INSERT");
    // });


    // Not working:
    /* The expect flow is:
        1) Insert into db the new user (due to first API call; POST /users).
        ------------------------------------------------------------------
        2) Try to fetch the user from Redis (due to second API call; GET /users/Jerry).
        3) The user shouldn't be present in Redis so fetch from DB.
        4) Push the user object from DB to Redis.
    */
    // it('successful create and fetch user', async () => {
    //     // Creating a new user
    //     const createUserResponse = await axios.post(`http://localhost:${SERVICE_UNDER_TEST_PORT}/users`,{
    //         firstName:'Jerry',
    //         lastName:'Smith',
    //     });
    //     expect(createUserResponse.status).toBe(200);
    //
    //     // Fetching the user we just created
    //     const fetchUserResponse = await axios.get(`http://localhost:${SERVICE_UNDER_TEST_PORT}/users/Jerry`);
    //     expect(fetchUserResponse.status).toBe(200);
    //
    //     // get spans created from the previous calls
    //     const telemetryRepo = await getTelemetryRepository();
    //     const sequelizeActivities = telemetryRepo.spans.sequelize();
    //     const redisActivities =  telemetryRepo.spans.redis();
    //
    //     // 1) Insert into db the new user (due to first API call; POST /users).
    //     expect(sequelizeActivities.first.dbOperation).toBe('INSERT');
    //     // 2) Try to fetch the user from Redis (due to second API call; GET /users/Jerry).
    //     expect(redisActivities.first.dbStatement).toBe("lrange Jerry 0 -1");
    //     expect(redisActivities.first.dbResponse).toBe("[]");
    //     // 3) The user shouldn't be present in Redis so fetch from DB.
    //     expect(sequelizeActivities.second.dbOperation).toBe("SELECT");
    //     //4) Push the user object from DB to Redis.
    //     expect(redisActivities.second.dbStatement.startsWith('lpush Jerry')).toBeTruthy();
    // });
});
