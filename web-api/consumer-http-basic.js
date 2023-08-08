import Fastify from 'fastify';
import fetch from 'node-fetch';

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '127.0.0.1';
const TARGET = process.env.TARGET || 'localhost:4000';

const server = Fastify({
    logger: true
});

server.get('/', async () => {
    const req = await fetch(`http://${TARGET}/recipes/42`);
    const data = await req.json();

    return {
        consumer_pid: process.pid,
        producer_data: data
    };
});

try {
    server.listen({ port: PORT, host: HOST })
} catch (err) {
    server.log.error(err)
    process.exit(1)
}