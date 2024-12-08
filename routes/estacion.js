const express = require("express");
const router = express.Router();
const db = require("../db"); // Conexión a la base de datos

// Obtener todos los contaminantes
router.get("/contaminantes", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT * FROM contaminante
    `);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error al obtener los contaminantes");
  }
});

module.exports = router;
