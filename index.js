'use strict'

var mongoose = require('mongoose');
var url = "mongodb://localhost:27017/api_rest_blog";
var opciones = {
    userNewUrlParser: true
}
var app = require('./app');
var port = 3900;

mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);

mongoose.connect(url,opciones)
.then(()=>{

    console.log('La conexión a la BDD correcta !!');

    // Crear servidor y ponerme a escuchar peticiones HTTP
    app.listen(port, () =>{
        console.log('Servidor corriendo en http://localhost:'+port);
    })
})