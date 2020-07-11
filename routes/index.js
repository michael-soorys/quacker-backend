import express from 'express';
import router from 'express/lib/router';

/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('index', { title: 'Express' });
});

export default router;
