import fp from 'fastify-plugin';

async function fastifySubscriptionModel(fastify, options, next) {
  const { waivioDb } = fastify;

  const Subscriptions = waivioDb.models.subscriptions;

  const followUser = async ({ follower, following }) => {
    const newSubscribe = new Subscriptions({
      follower,
      following,
    });

    try {
      await newSubscribe.save();
      return { result: true };
    } catch (error) {
      return { error };
    }
  };

  const unfollowUser = async ({ follower, following }) => {
    try {
      const result = await Subscriptions.deleteOne({ follower, following });
      if (!result || !result.n) {
        return { result: false };
      }
      return { result: true };
    } catch (error) {
      return { error };
    }
  };

  const findOne = async ({ condition }) => {
    try {
      return { subscription: await Subscriptions.findOne(condition).lean() };
    } catch (error) {
      return { error };
    }
  };

  const getFollowers = async ({ following, skip = 0, limit = 30 }) => {
    try {
      const result = await Subscriptions.find({ following }).skip(skip).limit(limit).select('follower')
        .lean();
      return { users: result.map((el) => el.follower) };
    } catch (error) {
      return { error };
    }
  };

  const getFollowings = async ({ follower, skip = 0, limit = 30 }) => {
    try {
      const result = await Subscriptions.find({ follower }).skip(skip).limit(limit).select('following')
        .lean();
      return { users: result.map((el) => el.following) };
    } catch (error) {
      return { error };
    }
  };

  const populate = async ({
    condition, select, sort, skip, limit, populate,
  }) => {
    try {
      const result = await Subscriptions
        .find(condition)
        .select(select)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate(populate)
        .lean();
      return { users: result };
    } catch (error) {
      return { error };
    }
  };

  const find = async ({
    condition, skip, limit, sort,
  }) => {
    try {
      return {
        subscriptionData: await Subscriptions
          .find(condition)
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .lean(),
      };
    } catch (error) {
      return { error };
    }
  };

  const getGuestSubscriptionsCount = async (userName, flag) => {
    try {
      const query = flag ? {
        follower: { $in: [/waivio_/, /bxy_/] },
        following: userName,
      } : {
        following: { $in: [/waivio_/, /bxy_/] },
        follower: userName,
      };
      return {
        count: await Subscriptions.find(query).count(),
      };
    } catch (error) {
      return { error };
    }
  };

  const getFollowingsCount = async (userName) => {
    try {
      return {
        count: await Subscriptions.find({ follower: userName }).count(),
      };
    } catch (error) {
      return { error };
    }
  };

  const deleteMany = async (condition) => {
    try {
      return {
        result: await Subscriptions.deleteMany(condition),
      };
    } catch (error) {
      return { error };
    }
  };

  fastify.decorate('subscriptionModel', {
    followUser,
    unfollowUser,
    findOne,
    getFollowers,
    getFollowings,
    populate,
    find,
    getGuestSubscriptionsCount,
    getFollowingsCount,
    deleteMany,
  });

  next();
}

export default fp(fastifySubscriptionModel, { name: 'fastifySubscriptionModel' });
