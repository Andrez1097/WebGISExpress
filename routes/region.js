const express = require("express");
const router = express.Router();
const db = require("../db"); // Archivo db.js para la conexión

// Obtener todas las regiones
router.get("/regiones", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM region");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error en el servidor");
  }
});

// Crear una región
router.post("/regiones", async (req, res) => {
  const { nombre, descripcion } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO region (nombre, descripcion) VALUES ($1, $2) RETURNING *",
      [nombre, descripcion]
    );
    res.status(201).json(result.rows[0]); // Retorna la región creada
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error al crear la región");
  }
  
});

// Actualizar una región
router.put("/regiones/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion } = req.body;
  try {
    const result = await db.query(
      "UPDATE region SET nombre = $1, descripcion = $2 WHERE id = $3 RETURNING *",
      [nombre, descripcion, id]
    );
    if (result.rowCount === 0) {
      res.status(404).send("Región no encontrada");
    } else {
      res.json(result.rows[0]); // Retorna la región actualizada
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error al actualizar la región");
  }
});

// Eliminar una región
router.delete("/regiones/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query("DELETE FROM region WHERE id = $1 RETURNING *", [id]);
    if (result.rowCount === 0) {
      res.status(404).send("Región no encontrada");
    } else {
      res.send("Región eliminada");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error al eliminar la región");
  }
});

module.exports = router;