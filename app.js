'use strict'

// piedra angular de la aplicacion
// cargar modulos de node para crear servidor
var express = require('express');
var bodyParser = require('body-parser');

// ejecutar express
var app = express();

// cargar ficheros rutas
var article_routes = require('./routes/article_route');

// Middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// CORS permitir peticiones al front-end ULTIMO PASO permite estos métodos y estas cabeceras nuestro api
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


//  Añadir prefijos a rutas / cargar rutas
app.use('/api',article_routes);

// anñadir prefijos a ruta

// ruta o metodo de prueba para el API-REST
// req recibo resp respuesta


// app.post('/datos-curso',(req,resp) => {
//     var mensaje = req.body.mensaje;

//     return resp.status(200).send(
//         {
//             curso: 'Master en Frameworks JS',
//             autor: 'Francisco Toapanta',
//             url: 'franciscoAndres.ec',
//             mensaje
//         }
//     );

// });

//exportar modulo (fichero actual)
module.exports = app;
