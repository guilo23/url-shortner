const { createClient } = require('redis');
const { Schema, Repository } = require('redis-om');

async function testRedisOM() {
  // Conecta ao Redis Stack
  const redisClient = createClient({ url: 'redis://localhost:6379' });
  redisClient.on('error', (err) => console.error('Erro no Redis:', err));
  await redisClient.connect();

  try {
    // Definindo o Schema corretamente com 'JSON' como estrutura de dados
    const testSchema = new Schema(
      {
        name: { type: 'string' }, // Definindo o campo "name" como string
      },
      {
        dataStructure: 'JSON' // Definindo a estrutura de dados como 'JSON'
      }
    );

    // Usar Repository com o schema correto
    const repository = new Repository(testSchema, redisClient);

    // Criar o índice
    await repository.createIndex();

    // Adicionar um objeto ao repositório
    const obj = repository.createEntity();
    obj.name = 'Meu primeiro objeto no Redis';
    await repository.save(obj);

    console.log('✅ redis-om inicializado com sucesso!');

    // Verificar os documentos indexados
    const searchResult = await repository.search().return.all();
    console.log('Documentos indexados:', searchResult);

  } catch (error) {
    console.error('Erro ao inicializar redis-om:', error);
  } finally {
    await redisClient.quit();
  }
}

testRedisOM();



