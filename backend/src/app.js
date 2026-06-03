const express = require("express");

const tareaRoutes = require("./routes/tareaRoutes");

const usuarioRoutes = require("./routes/usuarioRoutes");

const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        mensaje: "API Seminario_01 funcionando"
    });
});

app.use("/api/tareas", tareaRoutes);

app.use("/api/usuarios", usuarioRoutes);

app.use("/api/auth", authRoutes);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en puerto ${PORT}`);
});