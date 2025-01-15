// Write a script that:
// 1. Connects to Redis.
// 2. Saves the keys with their values.
// 3. Reads and outputs values for a given key.

// Use redis library

import { createClient } from 'redis';

async function manageRedis(): Promise<void> {
    const client = createClient();

    client.on('error', (err) => console.error('Redis Client Error', err));

    try {
        await client.connect();
        console.log('Connected to Redis');

        const keyValuePairs = {
            key1: 'value1',
            key2: 'value2',
            key3: 'value3',
        };

        for (const [key, value] of Object.entries(keyValuePairs)) {
            await client.set(key, value);
        }
        console.log('Keys and values saved to Redis');

        const keyToRead = 'key1';
        const value = await client.get(keyToRead);
        if (value) {
            console.log(`Value for key '${keyToRead}':`, value);
        } else {
            console.log(`Key '${keyToRead}' does not exist`);
        }
    } catch (error) {
        console.error('Error managing Redis:', error);
    } finally {
        await client.disconnect();
        console.log('Disconnected from Redis');
    }
}

module.exports = { manageRedis };