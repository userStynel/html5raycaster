var express = require('express');
var router = express.Router();

router.route('/').get(function(req, res){
    res.render('enter', {session: req.session});
});
router.route('/game').post(function(req, res){
    res.render('main', {name: req.body.name});
});

exports.router = router;