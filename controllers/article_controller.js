'use strict'
var validator = require('validator');
var Article = require('../models/article_model');
// para eliminar archivos de nuestro sistema de ficheros
var fs = require('fs');
var path = require('path');

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
        // console.log(articleId)

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

        
    },
    
    update: (req,res) => {
        
        // Recoger el id del articulo por la url
        var articleId = req.params.id

        // Recoger params de peticion PUT
        var params = req.body;

        // Validar
        try {
            var validate_titulo = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
        } catch (error) {
            return res.status(404).send({
                status: 'error',
                message: "Faltan datos por enviar !!"
            });
        }

        if (validate_titulo && validate_content){
            // Find and update
            Article.findOneAndUpdate({_id: articleId}, params, {new:true}, (err,articleUpdated) => {
                
                if(err){
                    return res.status(500).send({
                        status: 'error',
                        message: "Error al actualizar !!"
                    });
                }

                if(!articleUpdated){
                    return res.status(404).send({
                        status: 'error',
                        message: "No existe el artículo !!"
                    });
                }
                // respuesta JSON
                return res.status(200).send({
                    status: 'success',
                    article: articleUpdated
                });
            });
        }else{
            return res.status(200).send({
                status: 'error',
                message: "La validacion no es correcta !!"
            });
        }

    },
    
    delete: (req,res) => {
        // Recoger el id de la URL
        var articleId = req.params.id
        // Find and delete
        Article.findOneAndDelete({_id: articleId}, (err, articleRemoved) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: "Error al borrar !!"
                });
            }

            if(!articleRemoved){
                return res.status(404).send({
                    status: 'error',
                    message: "No se ha borrado el artículo, talvez no exista !!"
                });
            }

            return res.status(200).send({
                status: 'success',
                article: articleRemoved
            });

        });

    },
    
    upload: (req,res) => {

        // Configurar módulo de connect multiparty router/article_route.js

        // Recoger el fichero de la petición
        var file_name = 'Imagen no subida..';

        if(!req.files) {
            return res.status(404).send({
                status: 'error',
                message: file_name
            });
        }

        // Conseguir nombre y la extensión del archivo
        var file_path = req.files.file0.path;
        var file_split =  file_path.split('\\');

        // * ADVERTENCIA * en linux o mac
        // var file_split =  file_path.split('/');
        var file_name = file_split[2];

        // Extensión del fichero
        var extension_split = file_name.split('\.');
        var file_ext = extension_split[1];

        // Comprobar la extensión, solo imagenes, si es valida borrar el fichero
        if (file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif'){
            // Borrar el archivo subido
            fs.unlink(file_path, (err) => {
                return res.status(200).send({
                    status: 'error',
                    message: 'la extensión de la imagen no es válida !!'
                });
            });
        }else{

            // Si todo es valido
            var articleId = req.params.id;

            // Buscar el articulo, asignarle el nombre de la imagen y actualizarlo
            Article.findOneAndUpdate(
                {_id: articleId},
                {image: file_name},
                {new:true},
                (err, articleUpdated) => {
                    
                    if (err || !articleUpdated) {
                        return res.status(200).send({
                            status: 'error',
                            message: 'Error al guardar la imagen del artículo !!'
                        });
                    }
                    
                    return res.status(200).send({
                        status: 'success',
                        article: articleUpdated
                    });
                }
                );
        }

        
    },
    
    getImage: (req,res) => {
        var file = req.params.image;
        var path_file = './upload/articles/'+file;

        fs.exists(path_file,(exists) => {
            if(exists){
                return res.sendFile(path.resolve(path_file));
            }else{
                return res.status(404).send({
                    status: 'error',
                    message: 'La imagen no existe !!'
                });
            }
        });
    },
    
    search: (req,res) => {
        // Sacar el string a buscar 
        var searchString = req.params.search;

        // Find or SI EL searchString está ("i") incluido en el titulo lo retorna OR ("i") incluido en el content. SORT ordena datos por filtros en el array, y exec devuelve datos
        Article.find(
            {
                "$or": [
                    { 
                        "title": { "$regex": searchString, "$options": "i"}
                    },
                    { 
                        "content": { "$regex": searchString, "$options": "i"}
                    }
                ]
            }
        )
        .sort([['date', 'descending']])
        .exec((err, articles)=>{

            if(err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error en la peticion !!'
                })
            }
            
            if(!articles || articles.length <=0) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay artículos para mostrar !!'
                });
            }

            return res.status(200).send({
                status: 'success',
                articles
            });
        });
        
    }//Aqui abajo agregar nueva función


}; //fin controller

module.exports = controller;