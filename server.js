const express = require('express');
const path = require('path');
const routes = require('./routes/url-router'); 
const { initRepository } = require('./models/shortUrl');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.urlencoded({ extended: false }));

async function startServer() {
  try {
    await initRepository();
    console.log('Repositório Redis inicializado com sucesso.');


    app.use('/', routes);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });

  } catch (error) {
    console.error('Erro ao inicializar o repositório Redis:', error);
  }
}

startServer();
