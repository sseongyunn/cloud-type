const { Router } = require('express');
const ctrl = require('./ctrl');

const { authRequired } = require('../auth/middleware');

const router = Router();

router.get('/:articleId(\\d+)', ctrl.readArticle);

router.get('/compose', authRequired, ctrl.writeArticleForm);
router.post('/compose', authRequired, ctrl.writeArticle);

router.get('/edit/:articleId(\\d+)', authRequired, ctrl.editArticleForm);
router.post('/edit/:articleId(\\d+)', authRequired, ctrl.editArticle);

router.get('/delete/:articleId(\\d+)', authRequired, ctrl.deleteArticle);

module.exports = router;