import * as malabi from 'malabi';
malabi.instrument();
malabi.serveMalabiFromHttpApp(18393);

import axios from 'axios';
import * as express from 'express';

const PORT = process.env.PORT || 8080;

const app = express();
app.get('/todo', async (req, res) => {
    const todoItem = await axios.get('https://jsonplaceholder.typicode.com/todos/1');
    res.json({
        title: todoItem.data.title
    });
});

app.listen(PORT, () => console.log(`service-under-test started at port ${PORT}`));
