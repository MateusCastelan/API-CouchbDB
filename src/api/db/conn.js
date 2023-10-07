const nano = require('nano')({
    url: 'http://admin:admin@localhost:5984', // Substitua com a URL e as credenciais do seu CouchDB
    requestDefaults: { jar: true },
});

async function main() {
  try {
    const info = await nano.db.get('pessoa'); 
    console.log(`CouchDB conectado. Informações do banco de dados:`, info);
  } catch (err) {
    console.error('Erro na conexão com o CouchDB:', err);
  }
}

module.exports = main;
