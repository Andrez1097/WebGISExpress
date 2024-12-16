const express = require('express');
const router = express.Router();
const db = require('../db');

router.post("/statistics", async (req, res) => {
    const { contaminantes, regiones, estaciones, rangoFechas } = req.body;
  
    try {
      // Validaciones de entrada
      if (rangoFechas && (!rangoFechas.desde || !rangoFechas.hasta)) {
        return res.status(400).send("El rango de fechas debe incluir 'desde' y 'hasta'");
      }
  
      if (contaminantes && !Array.isArray(contaminantes)) {
        return res.status(400).send("'contaminantes' debe ser un array");
      }
  
      if (regiones && !Array.isArray(regiones)) {
        return res.status(400).send("'regiones' debe ser un array");
      }
  
      if (estaciones && !Array.isArray(estaciones)) {
        return res.status(400).send("'estaciones' debe ser un array");
      }
  
      // Construcción dinámica de filtros
      let filtros = [];
      let valores = [];
      let contador = 1;
  
      if (contaminantes && contaminantes.length > 0) {
        filtros.push(`c.nombre = ANY($${contador})`);
        valores.push(contaminantes);
        contador++;
      }
  
      if (regiones && regiones.length > 0) {
        filtros.push(`r.nombre = ANY($${contador})`);
        valores.push(regiones);
        contador++;
      }
  
      if (estaciones && estaciones.length > 0) {
        filtros.push(`em.nombre = ANY($${contador})`);
        valores.push(estaciones);
        contador++;
      }
  
      if (rangoFechas && rangoFechas.desde && rangoFechas.hasta) {
        filtros.push(`rc.fecha BETWEEN $${contador} AND $${contador + 1}`);
        valores.push(rangoFechas.desde, rangoFechas.hasta);
        contador += 2;
      }
  
      // Construcción de la consulta dinámica
      const query = `
        SELECT 
          c.nombre AS contaminante,
          r.nombre AS region,
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
        JOIN Contaminante c ON rc.contaminante_id = c.id
        JOIN EstacionMedicion em ON rc.estacion_id = em.id
        JOIN Region r ON em.region_id = r.id
        ${filtros.length > 0 ? "WHERE " + filtros.join(" AND ") : ""}
        GROUP BY c.nombre, r.nombre, em.nombre
        ORDER BY promedio DESC;
      `;
  
      // Ejecución de la consulta
      const result = await db.query(query, valores);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "No se encontraron registros con los filtros proporcionados" });
      }
  
      res.status(200).json(result.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Error en el servidor");
    }
  });
  
  // Ruta para varianza y coeficiente de variación por contaminante
  router.post("/variance-and-cv", async (req, res) => {
    const { contaminantes } = req.body;
  
    try {
      // Validación de contaminantes
      if (contaminantes && !Array.isArray(contaminantes)) {
        return res.status(400).send("'contaminantes' debe ser un array");
      }
  
      // Filtros
      let filtros = [];
      let valores = [];
      let contador = 1;
  
      if (contaminantes && contaminantes.length > 0) {
        filtros.push(`c.nombre = ANY($${contador})`);
        valores.push(contaminantes);
        contador++;
      }
  
      // Construcción de la consulta dinámica
      const query = `
        SELECT 
          c.nombre AS contaminante,
          VARIANCE(rc.valor) AS varianza,
          (STDDEV(rc.valor) / AVG(rc.valor)) * 100 AS coeficiente_variacion
        FROM RegistroContaminacion rc
        JOIN Contaminante c ON rc.contaminante_id = c.id
        ${filtros.length > 0 ? "WHERE " + filtros.join(" AND ") : ""}
        GROUP BY c.nombre
        ORDER BY varianza DESC
      `;
  
      // Ejecución de la consulta
      const result = await db.query(query, valores);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "No se encontraron registros con los filtros proporcionados" });
      }
  
      res.status(200).json(result.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Error en el servidor");
    }
  });
  
  module.exports = router;