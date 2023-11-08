import fp from 'fastify-plugin';
import mongoose from 'mongoose';

import waivioSchemas from '../schema/waivio/index.js';

async function fastifyMongoDb(fastify, options, next) {
  try {
    const waivioDb = await mongoose.connect(options.mongo.waivio);

    for (const waivioSc of waivioSchemas) waivioDb.model(waivioSc.name, waivioSc.schema);

    fastify
      .decorate('waivioDb', waivioDb)
      .addHook('onClose', async (instance, done) => {
        await waivioDb.connection.close(false);
        delete instance.waivioDb;
        done();
      });

    next();
  } catch (err) {
    next(err);
  }
}

export default fp(fastifyMongoDb, { name: 'fastify-mongoDb' });
