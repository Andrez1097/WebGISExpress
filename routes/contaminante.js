const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de la base de datos
const pool = new Pool({
  user: "tu_usuario",
  host: "localhost",
  database: "tu_base_de_datos",
  password: "tu_contraseña",
  port: 5432,
});

// Obtener todos los contaminantes
app.get("/api/contaminantes", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM contaminante");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error al obtener contaminantes:", err.message);
    res.status(500).send("Error al obtener contaminantes");
  }
});

// Agregar un nuevo contaminante
app.post("/api/contaminantes", async (req, res) => {
  const { id, nombre, descripcion } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO contaminante (id, nombre, descripcion) VALUES ($1, $2, $3) RETURNING *",
      [id, nombre, descripcion]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error al agregar contaminante:", err.message);
    res.status(500).send("Error al agregar contaminante");
  }
});

// Editar un contaminante existente
app.put("/api/contaminantes/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion } = req.body;
  try {
    const result = await pool.query(
      "UPDATE contaminante SET nombre = $1, descripcion = $2 WHERE id = $3 RETURNING *",
      [nombre, descripcion, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).send("Contaminante no encontrado");
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error al actualizar contaminante:", err.message);
    res.status(500).send("Error al actualizar contaminante");
  }
});

// Eliminar contaminantes seleccionados
app.delete("/api/contaminantes", async (req, res) => {
  const { ids } = req.body;
  try {
    const result = await pool.query("DELETE FROM contaminante WHERE id = ANY($1) RETURNING *", [ids]);
    if (result.rowCount === 0) {
      return res.status(404).send("No se encontraron contaminantes para eliminar");
    }
    res.send("Contaminantes eliminados exitosamente");
  } catch (err) {
    console.error("Error al eliminar contaminantes:", err.message);
    res.status(500).send("Error al eliminar contaminantes");
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
