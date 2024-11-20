var express = require('express');
var router = express.Router();
const db = require('../db');

/* GET home page. */
router.get('/', async function (req, res, next) {
  try {
    // Realiza una consulta a PostgreSQL
    const result = await db.query('SELECT * FROM my_table'); // Cambia `my_table` por tu tabla

    // Renderiza la vista con los datos obtenidos
    //Esto imprime primero.
    console.log(result.rows)
    
    res.render('index', { title: 'Express', data: result.rows }); // `result.rows` contiene los datos
    
  } catch (error) {
    console.error('Error al obtener datos:', error);
    next(error); // Maneja el error pasando al middleware de errores
  }
});

module.exports = router;
