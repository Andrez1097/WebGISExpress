const express = require("express");
const router = express.Router();
const db = require("../db"); // Archivo db.js para la conexión

// Middleware para validar que la región exista
const validarRegionExistente = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await db.query("SELECT * FROM region WHERE id = $1", [id]);
    if (result.rowCount === 0) {
      return res.status(404).send("Región no encontrada");
    }
    next(); // Si la región existe, continúa con el siguiente middleware o ruta
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Error al verificar la región");
  }
};

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

  // Validar que los datos estén presentes
  if (!nombre || !descripcion) {
    return res.status(400).send("Faltan datos requeridos (nombre, descripcion)");
  }

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
router.put("/regiones/:id", validarRegionExistente, async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion } = req.body;

  // Validar que los datos estén presentes
  if (!nombre || !descripcion) {
    return res.status(400).send("Faltan datos requeridos (nombre, descripcion)");
  }

  try {
    const result = await db.query(
      "UPDATE region SET nombre = $1, descripcion = $2 WHERE id = $3 RETURNING *",
      [nombre, descripcion, id]
    );
    res.json(result.rows[0]); // Retorna la región actualizada
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error al actualizar la región");
  }
});

// Eliminar una región
router.delete("/regiones/:id", validarRegionExistente, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query("DELETE FROM region WHERE id = $1 RETURNING *", [id]);
    res.send("Región eliminada");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error al eliminar la región");
  }
});

module.exports = router;
