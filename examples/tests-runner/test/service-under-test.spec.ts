const ServiceUnderTestPort = process.env.PORT || 8080;

import axios from 'axios';
import { fetchRemoteTests } from 'malabi';

describe('testing service-under-test remotely', () => {
    it('successful /todo request', async () => {
        // call to the service under test
        const res = await axios.get(`http://localhost:${ServiceUnderTestPort}/todo`);

        // get spans created from the previous call
        const spans = await fetchRemoteTests(18393);
        console.log(spans);
    });
});
