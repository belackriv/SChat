var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	var isDevEnv = (req.app.get('env') === 'development')?true:false;
	console.log('env is '+req.app.get('env'));
	res.render('index', { title: 'S-Chat', isDevEnv: isDevEnv });
});

module.exports = router;
