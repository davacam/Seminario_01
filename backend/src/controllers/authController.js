const usuarios = require("../models/usuarioModel");

const login = (req, res) => {

    const { email } = req.body;

    const usuario = usuarios.find(
        u => u.email === email
    );

    if (!usuario) {
        return res.status(404).json({
            mensaje: "Usuario no encontrado"
        });
    }

    res.json({
        mensaje: "Login exitoso",
        usuario
    });
};

module.exports = {
    login
};