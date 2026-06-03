const tareas = require("../models/tareaModel");

// Obtener todas las tareas
const obtenerTareas = (req, res) => {
    res.json(tareas);
};

// Obtener una tarea por ID
const obtenerTareaPorId = (req, res) => {
    const id = parseInt(req.params.id);

    const tarea = tareas.find(t => t.id === id);

    if (!tarea) {
        return res.status(404).json({
            mensaje: "Tarea no encontrada"
        });
    }

    res.json(tarea);
};

// Crear tarea
const crearTarea = (req, res) => {
    const nuevaTarea = {
        id: tareas.length + 1,
        ...req.body
    };

    tareas.push(nuevaTarea);

    res.status(201).json(nuevaTarea);
};



const actualizarTarea = (req, res) => {
    const id = parseInt(req.params.id);

    const tarea = tareas.find(t => t.id === id);

    if (!tarea) {
        return res.status(404).json({
            mensaje: "Tarea no encontrada"
        });
    }

    tarea.titulo = req.body.titulo || tarea.titulo;
    tarea.estado = req.body.estado || tarea.estado;

    res.json(tarea);
};


const eliminarTarea = (req, res) => {
    const id = parseInt(req.params.id);

    const indice = tareas.findIndex(t => t.id === id);

    if (indice === -1) {
        return res.status(404).json({
            mensaje: "Tarea no encontrada"
        });
    }

    tareas.splice(indice, 1);

    res.json({
        mensaje: "Tarea eliminada correctamente"
    });
};

module.exports = {
    obtenerTareas,
    obtenerTareaPorId,
    crearTarea,
    actualizarTarea,
    eliminarTarea
};