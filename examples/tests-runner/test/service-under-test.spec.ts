const SERVICE_UNDER_TEST_PORT = process.env.PORT || 8080;
import axios from 'axios';
import { fetchRemoteTelemetry, clearRemoteTelemetry } from 'malabi';
const getTelemetryRepository = async () => await fetchRemoteTelemetry({ portOrBaseUrl: 18393 });

describe('testing service-under-test remotely', () => {
    beforeEach(async () => {
        // We must reset all collected spans between tests to make sure span aren't leaking between tests.
        await clearRemoteTelemetry({ portOrBaseUrl: 18393 });
    });

    it('successful /todo request', async () => {
        // call to the service under test - internally it will call another API to fetch the todo items.
        const res = await axios(`http://localhost:${SERVICE_UNDER_TEST_PORT}/todo`);

        // get spans created from the previous call 
        const telemetryRepo = await getTelemetryRepository();
        
        // Validate internal HTTP call
        const todoInternalHTTPCall = telemetryRepo.spans.outgoing().first;
        expect(todoInternalHTTPCall.httpFullUrl).toBe('https://jsonplaceholder.typicode.com/todos/1')
        expect(todoInternalHTTPCall.statusCode).toBe(200);
    });

    it('successful /users request', async () => {
        // call to the service under test
        const res = await axios.get(`http://localhost:${SERVICE_UNDER_TEST_PORT}/users`);

        // get spans created from the previous call
        const telemetryRepo = await getTelemetryRepository();

        // Validating that /users had ran a single select statement and responded with an array.
        const sequelizeActivities =  telemetryRepo.spans.sequelize();
        expect(sequelizeActivities.length).toBe(1);
        expect(sequelizeActivities.first.dbOperation).toBe("SELECT");
        expect(Array.isArray(JSON.parse(sequelizeActivities.first.dbResponse))).toBe(true);
    });

    it('successful /users/Rick request', async () => {
        // call to the service under test
        const res = await axios.get(`http://localhost:${SERVICE_UNDER_TEST_PORT}/users/Rick`);

        // get spans created from the previous call
        const telemetryRepo = await getTelemetryRepository();

        const sequelizeActivities =  telemetryRepo.spans.sequelize();
        expect(sequelizeActivities.length).toBe(1);
        expect(sequelizeActivities.first.dbOperation).toBe("SELECT");

        const dbResponse = JSON.parse(sequelizeActivities.first.dbResponse);
        expect(Array.isArray(dbResponse)).toBe(true);
        expect(dbResponse.length).toBe(1);
    });

    it('Non existing user - /users/Rick111 request', async () => {
        // call to the service under test
        const res = await axios.get(`http://localhost:${SERVICE_UNDER_TEST_PORT}/users/Rick111`);

        // get spans created from the previous call
        const telemetryRepo = await getTelemetryRepository();

        const sequelizeActivities =  telemetryRepo.spans.sequelize();
        expect(sequelizeActivities.length).toBe(1);
        expect(sequelizeActivities.first.dbOperation).toBe("SELECT");

        const dbResponse = JSON.parse(sequelizeActivities.first.dbResponse);
        expect(Array.isArray(dbResponse)).toBe(true);
        expect(dbResponse.length).toBe(0);

        expect(telemetryRepo.spans.httpGet().first.statusCode).toBe(200);
    });

    it('successful POST /users request', async () => {
        // call to the service under test
        const res = await axios.post(`http://localhost:${SERVICE_UNDER_TEST_PORT}/users`,{
            firstName:'Morty',
            lastName:'Smith',
        });

        expect(res.status).toBe(200);

        // get spans created from the previous call
        const telemetryRepo = await getTelemetryRepository();

        // // Validating that /users created a new record in DB
        const sequelizeActivities =  telemetryRepo.spans.sequelize();
        expect(sequelizeActivities.length).toBe(1);
        expect(sequelizeActivities.first.dbOperation).toBe("INSERT");
    });


    /* The expect flow is:
        1) Insert into db the new user (due to first API call; POST /users).
        ------------------------------------------------------------------
        2) Try to fetch the user from Redis (due to second API call; GET /users/Jerry).
        3) The user shouldn't be present in Redis so fetch from DB.
        4) Push the user object from DB to Redis.
    */
    it('successful create and fetch user', async () => {
        // Creating a new user
        const createUserResponse = await axios.post(`http://localhost:${SERVICE_UNDER_TEST_PORT}/users`,{
            firstName:'Jerry',
            lastName:'Smith',
        });
        expect(createUserResponse.status).toBe(200);

        // Fetching the user we just created
        const fetchUserResponse = await axios.get(`http://localhost:${SERVICE_UNDER_TEST_PORT}/users/Jerry`);
        expect(fetchUserResponse.status).toBe(200);

        // get spans created from the previous calls
        const telemetryRepo = await getTelemetryRepository();
        const sequelizeActivities = telemetryRepo.spans.sequelize();
        const redisActivities =  telemetryRepo.spans.redis();

        // 1) Insert into db the new user (due to first API call; POST /users).
        expect(sequelizeActivities.first.dbOperation).toBe('INSERT');
        // 2) Try to fetch the user from Redis (due to second API call; GET /users/Jerry).
        expect(redisActivities.first.dbStatement).toBe("lrange Jerry 0 -1");
        expect(redisActivities.first.dbResponse).toBe("[]");
        // 3) The user shouldn't be present in Redis so fetch from DB.
        expect(sequelizeActivities.second.dbOperation).toBe("SELECT");
        //4) Push the user object from DB to Redis.
        expect(redisActivities.second.dbStatement.startsWith('lpush Jerry')).toBeTruthy();
    });
});
