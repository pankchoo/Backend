'use strict'
//  Una clase que nos da un molde para crear objetos, ESTA CLASE SE CONECTA A LA BASE
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArticleSchema = Schema ({
    title: String,
    content: String,
    date:{
        type: Date, default:Date.now
    },
    image: String
});

module.exports = mongoose.model('Article', ArticleSchema);
// articles --> guardo documentos de este tipo y estructura dentro de la colección