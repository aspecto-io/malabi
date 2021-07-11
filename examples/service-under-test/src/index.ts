import * as malabi from 'malabi';
malabi.instrument();
malabi.serveMalabiFromHttpApp(18393);

import axios from 'axios';
import express from 'express';
import User from "./db";

const PORT = process.env.PORT || 8080;

const app = express();
app.get('/todo', async (req, res) => {
    try {
        const todoItem = await axios('https://jsonplaceholder.typicode.com/todos/1');
        res.json({
            title: todoItem.data.title,
        });
    } catch (e) {
        res.sendStatus(500);
        console.error(e, e);
    }
});

app.get('/users', async (req, res) => {
    try {
        const users = await User.findAll({});
        res.json(users);
    } catch (e) {
        res.sendStatus(500);
        console.error(e, e);
    }
});

app.get('/users/:firstName', async (req, res) => {
    try {
        const firstName = req.param('firstName');
        if (!firstName) {
            res.status(400).json({ message: 'Missing firstName in url' });
            return;
        }
        const users = await User.findAll({ where: { firstName } });
        res.json(users);
    } catch (e) {
        res.sendStatus(500);
        console.error(e, e);
    }
});


app.listen(PORT, () => console.log(`service-under-test started at port ${PORT}`));
