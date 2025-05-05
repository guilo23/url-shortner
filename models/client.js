// client.js
const { Client } = require('redis-om');
const { createClient } = require('redis');

const url = "redis://localhost:6376";

async function createRedisClient() {
    const connection = createClient({ url });
    await connection.connect();

    const client = await new Client().use(connection);
    return client;
}

module.exports = createRedisClient;

