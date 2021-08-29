import { RedisMemoryServer } from 'redis-memory-server';
import Redis from "ioredis";
const redisServer = new RedisMemoryServer();

export async function getRedis() {
    const host = await redisServer.getHost();
    const port = await redisServer.getPort();
    const redis = new Redis(port, host);
    return redis;
}