'use strict'
var validator = require('validator');
var Article = require('../models/article_model');

var controller = {

    datosCurso: (req,resp) => {
        var mensaje = req.body.mensaje;
    
        return resp.status(200).send(
            {
                curso: 'Master en Frameworks JS',
                autor: 'Francisco Toapanta',
                url: 'franciscoAndres.ec',
                mensaje
            }
        );
    
    },

    test: (req,res) => {
        return res.status(200).send({
            message: 'Soy la accion test de mi controller de articulos'
        });
    },

    save: (req,res) => {
        // Captura de parametros por POST capturo todo el arreglo para su uso
        var params = req.body;
        // console.log(params);

        // Validar datos con libreria validator
        try {
            
            // Valida vacios en las variables
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);

        } catch (error) {
            // Retorna arreglo con mensaje de error
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar !!'
            });

        }

        if (validate_title && validate_content){
            
            // Crear objeto a guardar
            var article = new Article();

            // Asignar valores
            article.title = params.title;
            article.content = params.content;
            article.image = null;

            // Guardar el articulo
            article.save((err, articleStored) => {
                if (err || !articleStored) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'El artículo no se ha guardado !!'
                    });
                }

                // Devolver respuesta
                return res.status(200).send({
                    status: 'success',
                    article: articleStored
                });
            })
            
        }else{
            return res.status(200).send({
                status: 'error',
                message: 'Datos no son válidos !!'
            });
        }
    },

    getArticles: (req, res) => {
        var query = Article.find({});
        var last = req.params.last;
        if (last | last != undefined) {
            query.limit(5);
        }


        //Sacar datos de la base de datos
        query.sort('-_id').exec((err, articles) => {
            if (err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al consultar los datos !!'
                });
            }

            if (!articles){
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay artículos para mostrar !!'
                });
            }

            return res.status(200).send({
                status: 'success',
                articles
            });
        })
        
    },

    getArticle: (req,res) => {
        // Recoger id de la URL
        var articleId = req.params.id
        console.log(articleId)

        // Comprobar que existe
        if (!articleId || articleId == null){
            return res.status(404).send({
                status: 'error',
                message: 'No existe el artículo !!'
            });
        }

        // Buscar el artículo
        Article.findById(articleId, (err, article) => {
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al recuperar los datos !!'
                });
            }

            if (!article) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el artículo !!'
                });
            }

            // Devolver json
            return res.status(200).send({
                status: 'success',
                article
            });

        })

        
    }
}; //fin controller

module.exports = controller;