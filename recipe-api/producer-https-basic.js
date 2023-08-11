import Fastify from 'fastify';
import fs from 'fs';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = Fastify({
    logger: true,
    https: {
        key: fs.readFileSync(`${__dirname}/tls/producer-private-key.key`),
        cert: fs.readFileSync(`${__dirname}/../shared/tls/producer-certificate.cert`)
    }
});

server.get('/recipes/:id', async (req, res) => {
    const id = Number(req.params.id);
    if (id !== 42) {
        res.statusCode = 404;
        return { error: 'not_found' };
    }
    return {
        producer_pid: process.pid,
        recipe: {
            id,
            name: 'Chicken Tikka Masala',
            steps: 'Throw it in a pot...',
            ingredients: [{
                id: 1,
                name: 'Chicken',
                quantity: '1 lb'
            }, {
                id: 2,
                name: 'Sauce',
                quantity: '2 cups'
            }]
        }
    };
});

const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || '127.0.0.1';

try {
    server.listen({ port: PORT, host: HOST })
} catch (err) {
    server.log.error(err)
    process.exit(1)
}