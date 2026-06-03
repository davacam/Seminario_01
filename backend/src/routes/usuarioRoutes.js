const express = require("express");

const router = express.Router();

const {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    crearUsuario
} = require("../controllers/usuarioController");

router.get("/", obtenerUsuarios);

router.get("/:id", obtenerUsuarioPorId);

router.post("/", crearUsuario);

module.exports = router;