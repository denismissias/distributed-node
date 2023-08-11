import Fastify from 'fastify';
import fetch from 'node-fetch';
import fs from 'fs';
import https from 'https';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const server = Fastify({
    logger: true
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TARGET = process.env.TARGET || 'localhost:4000';

const options = {
    agent: new https.Agent({
        ca: fs.readFileSync(`${__dirname}/../shared/tls/ca-certificate.cert`)
    })
};

server.get('/', async () => {
    const req = await fetch(`https://${TARGET}/recipes/42`, options);
    const data = await req.json();

    return {
        consumer_pid: process.pid,
        producer_data: data
    };
});

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '127.0.0.1';

try {
    server.listen({ port: PORT, host: HOST })
} catch (err) {
    server.log.error(err)
    process.exit(1)
}