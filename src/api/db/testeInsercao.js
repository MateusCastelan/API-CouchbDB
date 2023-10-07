const nano = require('nano')({
    url: 'http://admin:senha-do-admin@localhost:5984', // Substitua 'senha-do-admin' pela senha do administrador
    requestDefaults: { jar: true },
  });
  
  const dbName = 'my_database'; // Substitua pelo nome do banco de dados
  
  // Crie o banco de dados
  nano.db.create(dbName, (err, body) => {
    if (err) {
      console.error('Erro ao criar o banco de dados:', err);
    } else {
      console.log('Banco de dados criado com sucesso:', body);
  
      // Use o banco de dados recém-criado
      const db = nano.db.use(dbName);
  
      const document = {
        name: 'John Doe',
        email: 'john@example.com',
        age: 30
      };
  
      // Insira o documento no banco de dados
      db.insert(document, (err, body) => {
        if (err) {
          console.error('Erro ao inserir o documento:', err);
        } else {
          console.log('Documento inserido com sucesso:', body);
        }
      });
    }
  });
  