'use strict'

// piedra angular de la aplicacion
// cargar modulos de node para crear servidor
var express = require('express');
var bodyParser = require('body-parser');

// ejecutar express
var app = express();
// cargar ficheros rutas
// Middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
// CORS permitir peticiones al front-end

// anñadir prefijos a ruta

// ruta o metodo de prueba para el API-REST
// req recibo resp respuesta
app.post('/datos-curso',(req,resp) => {
    var mensaje = req.body.mensaje;

    return resp.status(200).send(
        {
            curso: 'Master en Frameworks JS',
            autor: 'Francisco Toapanta',
            url: 'franciscoAndres.ec',
            mensaje
        }
    );

})

//exportar modulo (fichero actual)
module.exports = app;
