const express = require("express");
const router = express.Router();
const db = require("../db"); // Conexión a la base de datos

// Obtener todas las estaciones con el nombre de la región
router.get("/estaciones", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT e.*, r.nombre AS region_nombre 
      FROM estacionmedicion e 
      LEFT JOIN region r ON e.region_id = r.id
    `);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error al obtener las estaciones");
  }
});

// Obtener todas las regiones
router.get("/regiones", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM region"); // Suponiendo que tienes una tabla 'region'
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error al obtener las regiones");
  }
});

// Crear una estación
router.post("/estaciones", async (req, res) => {
  const { nombre, descripcion, latitud, longitud, region_id } = req.body;
  try {
    const result = await db.query(
      `
      INSERT INTO estacionmedicion (nombre, descripcion, latitud, longitud, region_id) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *
      `,
      [nombre, descripcion, latitud, longitud, region_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error al crear la estación");
  }
});

// Actualizar una estación
router.put("/estaciones/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, latitud, longitud, region_id } = req.body;
  try {
    const result = await db.query(
      `
      UPDATE estacionmedicion 
      SET nombre = $1, descripcion = $2, latitud = $3, longitud = $4, region_id = $5 
      WHERE id = $6 RETURNING *
      `,
      [nombre, descripcion, latitud, longitud, region_id, id]
    );
    if (result.rowCount === 0) {
      res.status(404).send("Estación no encontrada");
    } else {
      res.json(result.rows[0]);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error al actualizar la estación");
  }
});

// Eliminar una estación
router.delete("/estaciones/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      "DELETE FROM estacionmedicion WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rowCount === 0) {
      res.status(404).send("Estación no encontrada");
    } else {
      res.send("Estación eliminada");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error al eliminar la estación");
  }
});

module.exports = router;
