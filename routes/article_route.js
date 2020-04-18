'use strict'

var express = require('express');
var ArticleController = require('../controllers/article_controller'); 

var router = express.Router();

// Rutas de prueba
router.post('/datos-curso', ArticleController.datosCurso);
router.get('/test-controlador', ArticleController.test);

// Rutas útiles
router.post('/save', ArticleController.save);
router.post('/articles/:last?', ArticleController.getArticles);
router.post('/article/:id', ArticleController.getArticle);

module.exports = router;

