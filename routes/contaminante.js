const express = require("express");
const router = express.Router();
const db = require("../db"); // Conexión a la base de datos

// Obtener todos los contaminantes
router.get("/contaminantes", async (req, res) => {
    try {
        const result = await db.query("SELECT id, nombre, descripcion FROM contaminante");
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error al obtener los contaminantes");
    }
});

// Crear un contaminante
router.post("/contaminantes", async (req, res) => {
    const { nombre, descripcion } = req.body;
    try {
        const result = await db.query(
            `INSERT INTO contaminante (nombre, descripcion) VALUES ($1, $2) RETURNING *`,
            [nombre, descripcion]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error al crear el contaminante");
    }
});

// Actualizar un contaminante
router.put("/contaminantes/:id", async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;
    try {
        const result = await db.query(
            `UPDATE contaminante SET nombre = $1, descripcion = $2 WHERE id = $3 RETURNING *`,
            [nombre, descripcion, id]
        );
        if (result.rowCount === 0) {
            res.status(404).send("Contaminante no encontrado");
        } else {
            res.json(result.rows[0]);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error al actualizar el contaminante");
    }
});

// Eliminar un contaminante
router.delete("/contaminantes/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query(
            "DELETE FROM contaminante WHERE id = $1 RETURNING *",
            [id]
        );
        if (result.rowCount === 0) {
            res.status(404).send("Contaminante no encontrado");
        } else {
            res.send("Contaminante eliminado");
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error al eliminar el contaminante");
    }
});

// Obtener un contaminante específico
router.get("/contaminantes/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query("SELECT id, nombre, descripcion FROM contaminante WHERE id = $1", [id]);
        if (result.rowCount === 0) {
            res.status(404).send("Contaminante no encontrado");
        } else {
            res.status(200).json(result.rows[0]);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error al obtener el contaminante");
    }
});

module.exports = router;
