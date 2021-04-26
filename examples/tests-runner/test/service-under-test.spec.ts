const ServiceUnderTestPort = process.env.PORT || 8080;

import axios from 'axios';

describe('testing service-under-test remotely', () => {
    it('successful /todo request', async () => {
        const res = await axios.get(`http://localhost:${ServiceUnderTestPort}/todo`);
        console.log(res.data);
    });
});
