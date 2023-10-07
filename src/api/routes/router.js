const express = require("express");
const router = express.Router();
const pessoaRouter = require("./pessoaRouter");

router.use("/", pessoaRouter);

module.exports = router;