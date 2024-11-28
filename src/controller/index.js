const { Router } = require('express');

const ctrl = require('./ctrl');

const article = require('./article');

const auth = require('./auth');

const router = Router();

router.get('/', ctrl.indexPage);

router.get('/articles/page/:page(\\d+)', ctrl.listArticles);
router.get('/articles', ctrl.latestArticles);

router.use('/article', article);

router.use('/auth', auth);

module.exports = router;