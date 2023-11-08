import fp from 'fastify-plugin';

async function product(fastify, options, next) {
  // const findOneById = async ({ id }) => productModel.getProductById(id);
  //
  // const findOneByName = async ({ name }) => productModel.getProductByName(name);
  const create = async (newProduct) => ({ product: 'product' });

  const productService = {
    create,
  };

  fastify.decorate('productService', productService);

  next();
}

export default fp(product, { name: 'fastify-productService' });
