const ServiceUnderTestPort = process.env.PORT || 8080;

import axios from 'axios';
import { fetchRemoteTests } from 'malabi';

describe('testing service-under-test remotely', () => {
    it('successful /todo request', async () => {
        const res = await axios.get(`http://localhost:${ServiceUnderTestPort}/todo`);
        const spans = await fetchRemoteTests(18393);
        console.log(spans);
    });
});
