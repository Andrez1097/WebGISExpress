const express = require('express');
const router = express.Router();
const db = require('../db');

router.get("/regiones", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM region");
    console.log(result.rows)
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error en el servidor");
  }
});

module.exports = router;