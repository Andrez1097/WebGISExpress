const express = require('express');
const router = express.Router();
const db = require('../db');

router.get("/geopoints", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM estacionmedicion");
    console.log(result.rows)
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error en el servidor");
  }
});

/*router.get("/statistics", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM estacionmedicion");
    console.log(result.rows)
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error en el servidor");
  }
});*/

// Estadísticas por contaminante
router.get("/statistics-by-contaminant", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        c.nombre AS contaminante,
        AVG(rc.valor) AS promedio,
        STDDEV(rc.valor) AS desviacion_estandar,
        MAX(rc.valor) AS maximo,
        MIN(rc.valor) AS minimo,
        MAX(rc.valor) - MIN(rc.valor) AS rango,
        PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY rc.valor) AS cuartil_1,
        PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY rc.valor) AS mediana,
        PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY rc.valor) AS cuartil_3
      FROM RegistroContaminacion rc
      JOIN Contaminante c ON rc.contaminante_id = c.id
      GROUP BY c.nombre
      ORDER BY promedio DESC
    `);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error en el servidor");
  }
});

// Estadísticas por región
router.get("/statistics-by-region", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        r.nombre AS region,
        AVG(rc.valor) AS promedio,
        STDDEV(rc.valor) AS desviacion_estandar,
        MAX(rc.valor) AS maximo,
        MIN(rc.valor) AS minimo,
        MAX(rc.valor) - MIN(rc.valor) AS rango,
        PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY rc.valor) AS cuartil_1,
        PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY rc.valor) AS mediana,
        PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY rc.valor) AS cuartil_3
      FROM RegistroContaminacion rc
      JOIN EstacionMedicion em ON rc.estacion_id = em.id
      JOIN Region r ON em.region_id = r.id
      GROUP BY r.nombre
      ORDER BY promedio DESC
    `);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error en el servidor");
  }
});

// Estadísticas por estación
router.get("/statistics-by-station", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        em.nombre AS estacion,
        AVG(rc.valor) AS promedio,
        STDDEV(rc.valor) AS desviacion_estandar,
        MAX(rc.valor) AS maximo,
        MIN(rc.valor) AS minimo,
        MAX(rc.valor) - MIN(rc.valor) AS rango,
        PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY rc.valor) AS cuartil_1,
        PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY rc.valor) AS mediana,
        PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY rc.valor) AS cuartil_3
      FROM RegistroContaminacion rc
      JOIN EstacionMedicion em ON rc.estacion_id = em.id
      GROUP BY em.nombre
      ORDER BY promedio DESC
    `);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error en el servidor");
  }
});

// Varianza y coeficiente de variación por contaminante
router.get("/variance-and-cv-by-contaminant", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        c.nombre AS contaminante,
        VARIANCE(rc.valor) AS varianza,
        (STDDEV(rc.valor) / AVG(rc.valor)) * 100 AS coeficiente_variacion
      FROM RegistroContaminacion rc
      JOIN Contaminante c ON rc.contaminante_id = c.id
      GROUP BY c.nombre
      ORDER BY varianza DESC
    `);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error en el servidor");
  }
});

// Otras rutas combinadas ...

module.exports = router;