import * as malabi from 'malabi';
malabi.instrument();
malabi.serveMalabiFromHttpApp(18393);

import axios from 'axios';
import express from 'express';
import body from "body-parser";
import User from "./db";
import { getRedis } from "./redis";
import Redis from "ioredis";
let redis: Redis.Redis;

getRedis().then((redisConn) => {
    redis = redisConn;
})
const PORT = process.env.PORT || 8080;

const app = express();
app.use(body.json())
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

        let users = [];
        users = await redis.lrange(firstName, 0, -1);
        if (users.length === 0) {
            users = await User.findAll({ where: { firstName } });
            if (users.length !== 0) {
                await redis.lpush(firstName, users)
            }
        }

        res.json(users);
    } catch (e) {
        res.sendStatus(500);
        console.error(e, e);
    }
});

app.post('/users', async (req, res) => {
    try {
        const { firstName, lastName } = req.body;
        const user = await User.create({ firstName, lastName });
        res.json(user);
    } catch (e) {
        res.sendStatus(500);
    }
})


app.listen(PORT, () => console.log(`service-under-test started at port ${PORT}`));
