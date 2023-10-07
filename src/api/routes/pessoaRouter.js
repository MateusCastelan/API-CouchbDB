const express = require("express");
const router = express.Router();

const pessoaController = require("../controller/pessoaController");

router
  .route("/pessoa")
  .post((req, res) => pessoaController.createPessoa(req, res));

router
  .route("/pessoa/insertRandom")
  .post((req, res) => pessoaController.createManyRandom(req, res));

router
  .route("/pessoa")
  .get((req, res) => pessoaController.getAll(req, res));

router
  .route("/pessoa/:id")
  .get((req, res) => pessoaController.getOne(req, res));

router
  .route("/pessoa/:id")
  .put((req, res) => pessoaController.update(req, res));

router
  .route("/pessoa/:id")
  .delete((req, res) => pessoaController.delete(req, res));

module.exports = router;