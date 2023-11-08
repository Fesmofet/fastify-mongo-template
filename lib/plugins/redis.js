import fp from 'fastify-plugin';
import { createClient } from 'redis';

async function fastifyRedis(fastify, options, next) {
  try {
    const redis2 = await createClient({
      url: options.redis.url,
      database: 2,
    })
      .on('error', (err) => fastify.log.error('Redis Client Error', err))
      .connect();
    fastify.log.info('redis client connected');

    fastify
      .decorate('redis2', redis2)
      .addHook('onClose', async (instance, done) => {
        await redis2.disconnect();

        delete instance.redis2;
        done();
      });

    next();
  } catch (err) {
    next(err);
  }
}

export default fp(fastifyRedis, { name: 'fastify-redis' });
