const express = require('express');
const router = express.Router();
const db = require('../db');

// Aqui hay
router.get('/geopoints', (req, res) => {
    /*try {
    // Realiza una consulta a PostgreSQL
    const result = await db.query('SELECT * FROM my_table'); // Cambia `my_table` por tu tabla

    // Renderiza la vista con los datos obtenidos
    //Esto imprime primero.
    console.log(result.rows)

    res.render('index', { title: 'Express', data: result.rows }); // `result.rows` contiene los datos
    
  } catch (error) {
    console.error('Error al obtener datos:', error);
    next(error); // Maneja el error pasando al middleware de errores
  }*/

 //por ahora quemados, pero la idea es usar la base de datos para devolver los valores correctos.
 
  const puntos = [
    {id: 1, nombre: "via industrial occidental", latitud: 6.225925, longitud: -75.549889 },
    {id: 2, nombre: "portal occidental", latitud: 6.225436, longitud: -75.514164 },
    {id: 3, nombre: "portal oriental", latitud: 6.181306, longitud: -75.454422 },
    {id: 4, nombre: "casa verde", latitud: 6.222864, longitud: -75.534483 },
    {id: 5, nombre: "peaje sajonia", latitud: 6.179464, longitud: -75.452617 }
];

  res.json(puntos);
});

module.exports = router;