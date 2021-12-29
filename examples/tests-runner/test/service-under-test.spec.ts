const SERVICE_UNDER_TEST_PORT = process.env.PORT || 8080;
import { malabi } from 'malabi';

import { expect } from 'chai';
import axios from 'axios';

describe('testing service-under-test remotely', () => {

    it('successful /todo request', async () => {
        // get spans created from the previous call
        const telemetryRepo = await malabi( async () => {
            await axios(`http://localhost:${SERVICE_UNDER_TEST_PORT}/todo`);
        });

        // Validate internal HTTP call
        const todoInternalHTTPCall = telemetryRepo.spans.outgoing().first;
        expect(todoInternalHTTPCall.httpFullUrl).equals('https://jsonplaceholder.typicode.com/todos/1')
        expect(todoInternalHTTPCall.statusCode).equals(200);
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

    it('successful POST /users request', async () => {
        // get spans created from the previous call
        const telemetryRepo = await malabi( async () => {
            // call to the service under test
            const res = await axios.post(`http://localhost:${SERVICE_UNDER_TEST_PORT}/users`,{
                firstName:'Morty',
                lastName:'Smith',
            });
            expect(res.status).equals(200);
        });

        // Validating that /users created a new record in DB
        const sequelizeActivities = telemetryRepo.spans.sequelize();
        expect(sequelizeActivities.length).equals(1);
        expect(sequelizeActivities.first.dbOperation).equals("INSERT");
    });

    /* The expected flow is:
        1) Insert into db the new user (due to first API call; POST /users).
        ------------------------------------------------------------------
        2) Try to fetch the user from Redis (due to second API call; GET /users/Jerry).
        3) The user shouldn't be present in Redis so fetch from DB.
        4) Push the user object from DB to Redis.
    */
    it('successful create and fetch user', async () => {
        const telemetryRepo = await malabi( async () => {
            // Creating a new user
            const createUserResponse = await axios.post(`http://localhost:${SERVICE_UNDER_TEST_PORT}/users`,{
                firstName:'Jerry',
                lastName:'Smith',
            });
            expect(createUserResponse.status).equals(200);
            const fetchUserResponse = await axios.get(`http://localhost:${SERVICE_UNDER_TEST_PORT}/users/Jerry`);
            expect(fetchUserResponse.status).equals(200);
        });

        const sequelizeActivities = telemetryRepo.spans.sequelize();
        const redisActivities =  telemetryRepo.spans.redis();

        // 1) Insert into db the new user (due to first API call; POST /users).
        expect(sequelizeActivities.first.dbOperation).equals('INSERT');
        // 2) Try to fetch the user from Redis (due to second API call; GET /users/Jerry).
        expect(redisActivities.first.dbStatement).equals("lrange Jerry 0 -1");
        expect(redisActivities.first.dbResponse).equals("[]");
        // 3) The user shouldn't be present in Redis so fetch from DB.
        expect(sequelizeActivities.second.dbOperation).equals("SELECT");
        //4) Push the user object from DB to Redis.
        expect(redisActivities.second.dbStatement.startsWith('lpush Jerry')).equals(true);
    });
});
