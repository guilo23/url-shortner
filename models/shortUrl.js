const { Schema, Entity } = require('redis-om');
const shortid = require('shortid');
const createRedisClient = require('./client');

class ShortUrl extends Entity {}

const shortUrlSchema = new Schema(ShortUrl, {
  full: { type: 'string' },
  short: { type: 'string', default: () => shortid.generate() },
  clicks: { type: 'number', default: 0 }
});

let shortUrlRepository;

async function initRepository() {
    const client = await createRedisClient();
    shortUrlRepository = client.fetchRepository(shortUrlSchema);
    await shortUrlRepository.createIndex();
    console.log('Repositório Redis inicializado com sucesso.');
}

function getRepository() {
  if (!shortUrlRepository) {
    throw new Error('Repository not initialized yet. Await initRepository() first.');
  }
  return shortUrlRepository;
}

module.exports = {
    ShortUrl,
    initRepository,
    getRepository: () => shortUrlRepository
  };
