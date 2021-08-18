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
        expect(true).toBeFalsy();
        // call to the service under test - internally it will call another API to fetch the todo items.
        const res = await axios(`http://localhost:${SERVICE_UNDER_TEST_PORT}/todo`);

        // get spans created from the previous call 
        const telemetryRepo = await getTelemetryRepository();
        
        // Validate internal HTTP call
        const todoInteralHTTPCall = telemetryRepo.spans.outgoing().first;
        expect(todoInteralHTTPCall.httpFullUrl).toBe('https://jsonplaceholder.typicode.com/todos/1')
        expect(todoInteralHTTPCall.statusCode).toBe(200);
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
});
