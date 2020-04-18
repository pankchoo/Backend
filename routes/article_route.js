'use strict'

var express = require('express');
var ArticleController = require('../controllers/article_controller'); 
var multipart = require('connect-multiparty');

var router = express.Router();
var md_upload = multipart({
    uploadDir: './upload/articles'
})


// Rutas de prueba
router.post('/datos-curso', ArticleController.datosCurso);
router.get('/test-controlador', ArticleController.test);

// Rutas útiles
router.post('/article/save', ArticleController.save);
router.get('/articles/:last?', ArticleController.getArticles);
router.get('/article/:id', ArticleController.getArticle);
router.put('/article/:id', ArticleController.update);
router.delete('/article/:id', ArticleController.delete);
// Para la subida de archivos
router.post('/upload-image/:id', md_upload, ArticleController.upload);

module.exports = router;

