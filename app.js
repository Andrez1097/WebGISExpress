var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var geopointsRouter = require('./routes/geopoints');
var statisticsRouter = require('./routes/statistics');
var regionRoutes = require('./routes/region');
var estacionRoutes = require('./routes/estacion');


var app = express();
const cors = require('cors');

// Configuración del motor de vistas
app.set('views', path.join(__dirname, 'views')); // Ruta de las vistas
app.engine('html', require('ejs').renderFile);  // Usar EJS para archivos .html
app.set('view engine', 'html');                 // Motor de vistas como HTML

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Habilitar CORS para todas las solicitudes
app.use(
  cors({
    origin: 'http://127.0.0.1:3000', // Permitir solo este origen
  })
);

// Rutas
app.use('/', indexRouter);
//app.use('/users', usersRouter);
app.use('/api', geopointsRouter);
app.use('/api', statisticsRouter);
app.use('/api', regionRoutes);
app.use('/api', estacionRoutes);


// Manejador de errores 404
app.use(function(req, res, next) {
  next(createError(404));
});

// Manejador de errores
app.use(function(err, req, res, next) {
  // Configurar variables locales de error
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Renderizar página de error
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;