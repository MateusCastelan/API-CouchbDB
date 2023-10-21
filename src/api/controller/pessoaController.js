const nano = require('nano')({
    url: 'http://admin:admin@localhost:5984', // Substitua com a URL e as credenciais do seu CouchDB
    requestDefaults: { jar: true },
});
const dbName = 'pessoa'; // Nome do banco de dados CouchDB

const db = nano.db.use(dbName);
const faker = require('faker'); 

const pessoaController = {
  createPessoa: async (req, res) => {
    try {
      const pessoa = {
        nome: req.body.nome,
        dataNascimento: req.body.dataNascimento,
        profissao: req.body.profissao,
        cor: req.body.cor,
        estado: req.body.estado,
        cidade: req.body.cidade
      };
      const response = await db.insert(pessoa);
      res.status(201).json({ id: response.id, msg: 'Pessoa criada com sucesso' });
    } catch (error) {
      console.error('Erro ao criar pessoa:', error);
      res.status(500).json({ error: 'Erro ao criar pessoa' });
    }
  },

  createManyRandom: async (req, res) => {
    try {
      const quantidade = 1000;
      const randomPessoas = [];

      for (let i = 0; i < quantidade; i++) {
        const pessoa = {
          nome: faker.name.findName(),
          dataNascimento: faker.date.past(),
          profissao: faker.name.jobTitle(),
          cor: faker.random.arrayElement(['Branco', 'Negro', 'Pardo', 'Amarelo', 'Indígena']),
          estado: faker.address.state(),
          cidade: faker.address.city(),
        };
        randomPessoas.push(pessoa);
      }

      const result = await db.bulk({ docs: randomPessoas });
      res.json(`${result.length} pessoas inseridas no CouchDB`);
    } catch (error) {
      console.error('Erro ao inserir pessoas no CouchDB:', error);
      res.status(500).json({ error: 'Erro ao inserir pessoas no CouchDB' });
    }
  },

  getAll: async (req, res) => {
    try {
      const response = await db.list({ include_docs: true });
      const pessoas = response.rows.map(row => row.doc);
      res.json(pessoas);
    } catch (error) {
      console.error('Erro ao listar pessoas:', error);
      res.status(500).json({ error: 'Erro ao listar pessoas' });
    }
  },

  getOne: async (req, res) => {
    const id = req.params.id;
    try {
      const pessoa = await db.get(id);
      res.json(pessoa);
    } catch (error) {
      if (error.statusCode === 404) {
        return res.status(404).json({ message: 'Pessoa não encontrada' });
      }
      console.error('Erro ao obter pessoa por ID:', error);
      res.status(500).json({ error: 'Erro ao obter pessoa por ID' });
    }
  },

  update: async (req, res) => {
    const id = req.params.id;
    try {
      const pessoa = {
        _id: id,
        _rev: req.body._rev, // Certifique-se de incluir a revisão (_rev) para atualizar o documento corretamente
        nome: req.body.nome,
        dataNascimento: req.body.dataNascimento,
        profissao: req.body.profissao,
        cor: req.body.cor,
        estado: req.body.estado,
        cidade: req.body.cidade
      };
      const response = await db.insert(pessoa);
      res.status(200).json({ id: response.id, msg: "Pessoa atualizada com sucesso!" });
    } catch (error) {
      if (error.statusCode === 404) {
        return res.status(404).json({ message: 'Pessoa não encontrada' });
      }
      console.error('Erro ao atualizar pessoa por ID:', error);
      res.status(500).json({ error: 'Erro ao atualizar pessoa por ID' });
    }
  },

  updateManyRandom: async (req, res) => {
    db.list({ include_docs: true }, async (err, body) => {
      if (err) {
        console.log('Erro ao buscar documentos:', err);
        res.status(500).send('Erro ao buscar documentos.');
        return;
      }
  
      const documentos = body.rows.map(row => {
        const doc = row.doc;
        return {
          ...doc,
          nome: faker.name.findName(),
          dataNascimento: faker.date.past(),
          profissao: faker.name.jobTitle(),
          cor: faker.random.arrayElement(['Branco', 'Negro', 'Pardo', 'Amarelo', 'Indígena']),
          estado: faker.address.state(),
          cidade: faker.address.city(),
        };
      });
  
      const quantidade = 1000;
      const availableIndices = Array.from({ length: documentos.length }, (_, i) => i);
  
      for (let i = 0; i < quantidade && availableIndices.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * availableIndices.length);
        const selectedIndex = availableIndices.splice(randomIndex, 1)[0];
        const doc = documentos[selectedIndex];
  
        try {
          // Obtenha a revisão do documento existente
          const existingDocument = await db.get(doc._id);
          const update = {
            _id: doc._id,
            _rev: existingDocument._rev, // Inclua a revisão correta
            nome: doc.nome,
            dataNascimento: doc.dataNascimento,
            profissao: doc.profissao,
            cor: doc.cor,
            estado: doc.estado,
            cidade: doc.cidade,
          };
  
          // Use db.insert para atualizar o documento
          await db.insert(update);
          console.log(`Documento com ID ${doc._id} atualizado.`);
        } catch (error) {
          console.log(`Erro ao atualizar o documento com ID ${doc._id}:`, error);
        }
      }
  
      res.status(200).send('Documentos atualizados com sucesso.');
    });
  },
  

  

  delete: async (req, res) => {
    const id = req.params.id;
    try {
      const pessoa = await db.get(id);
      const response = await db.destroy(id, pessoa._rev); // Certifique-se de incluir a revisão (_rev) para excluir o documento corretamente
      res.status(200).json({ id: response.id, msg: "Pessoa excluída com sucesso!" });
    } catch (error) {
      if (error.statusCode === 404) {
        return res.status(404).json({ message: 'Pessoa não encontrada' });
      }
      console.error('Erro ao excluir pessoa por ID:', error);
      res.status(500).json({ error: 'Erro ao excluir pessoa por ID' });
    }
  },



  deleteAllData: async (req, res) => {
    try {
        // Exclua o banco de dados existente
      await nano.db.destroy(dbName);

      // Crie um novo banco de dados com o mesmo nome
      await nano.db.create(dbName);

      res.json({ message: 'Todos os dados excluídos do CouchDB' });
    } catch (error) {
      console.error('Erro ao excluir dados do CouchDB:', error);
      res.status(500).json({ error: 'Erro ao excluir dados do CouchDB' });
    }
  }
};

module.exports = pessoaController;


