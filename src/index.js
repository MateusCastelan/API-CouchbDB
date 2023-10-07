const express = require('express');
const app = express();

app.use(function(req, res, next){ 
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "content-type");
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
   }); 

   
// Chama a função para conectar com o banco
const conn = require("./api/db/conn");
conn();

app.use(express.json());

// Chama o arquivo com todas as rotas
const routes = require('./api/routes/router');
app.use('/api', routes)

// API na porta 3000
app.listen(3000, function () { 
    console.log('Aplicação executando na porta 3000!'); 
});