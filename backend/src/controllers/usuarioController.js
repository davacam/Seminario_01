const usuarios = require("../models/usuarioModel");

// Obtener usuarios
const obtenerUsuarios = (req, res) => {
    res.json(usuarios);
};

// Obtener usuario por ID
const obtenerUsuarioPorId = (req, res) => {
    const id = parseInt(req.params.id);

    const usuario = usuarios.find(u => u.id === id);

    if (!usuario) {
        return res.status(404).json({
            mensaje: "Usuario no encontrado"
        });
    }

    res.json(usuario);
};

// Crear usuario
const crearUsuario = (req, res) => {
    const nuevoUsuario = {
        id: usuarios.length + 1,
        ...req.body
    };

    usuarios.push(nuevoUsuario);

    res.status(201).json(nuevoUsuario);
};

module.exports = {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    crearUsuario
};