const nano = require('nano')({
    url: 'http://admin:admin@localhost:5984', // Substitua com a URL e as credenciais do seu CouchDB
    requestDefaults: { jar: true },
});

async function main() {
  try {
    const dbInfo = await nano.db.get('pessoa');
    console.log(`CouchDB conectado! Informações do banco: `, dbInfo);
    
  } catch (err) {
    console.error('Erro na conexão com o CouchDB:', err);

    if (err.statusCode === 404) {

      console.log('Banco de dados "pessoa" não encontrado. Criando...');
      
      // Crie o banco de dados "pessoa"
      await nano.db.create('pessoa');
      console.log('Banco de dados "pessoa" criado com sucesso.');

      const db = nano.use('pessoa');
      console.log('Conectado ao banco de dados "pessoa".')

    } else {
    console.error('Erro na conexão com o CouchDB:', err);
    }
  }
}

module.exports = main;
