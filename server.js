const express = require('express');
const path = require('path');
const shortid = require('shortid');
const { initRepository, getRepository } = require('./models/shortUrl');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: false }));

initRepository().then(() => {
  console.log('Repositório Redis inicializado com sucesso.');

  // Rotas só são registradas depois da inicialização
  app.get('/', async (req, res) => {
    const repo = getRepository();
    const entities = await repo.search().return.all();
    const shortUrls = entities.map(e => e.toJSON());
    res.render('index', { shortUrls });
  });

  app.post('/shortUrls', async (req, res) => {
    const repo = getRepository();
    const { fullUrl } = req.body;
  
    const shortUrl = repo.createEntity({
      full: fullUrl,
      short: shortid.generate(),
      clicks: 0
    });
  
    console.log('Salvando dados no Redis:', shortUrl);
    await repo.save(shortUrl);  // Salva a instância da entidade
    res.redirect('/');
  });
  app.get('/:short', async (req, res) => {
    const repo = getRepository();
    const results = await repo.search()
      .where('short').equals(req.params.short)
      .return.all();
    const url = results[0];
    url.clicks++;
    await repo.save(url);
    res.redirect(url.full);

  });

  app.listen(process.env.PORT || 5000);
});
