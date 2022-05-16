var express = require('express');
var router = express.Router();

router.route('/').get(function(req, res){
    res.render('enter', {session: req.session});
});

router.route('/lobby').post(function(req, res){
    res.cookie('name', req.body.name);
    res.render('lobby', {name: req.body.name, roomList: roomManager.serializeRoomList()});
});

router.route('/game').get(function(req, res){
    let hash = req.query.room;
    let key = req.query.key
    if(roomManager.roomlist[hash].auth(key)){
        let admin = false;
        if(roomManager.roomlist[hash].userCount == 0) admin = true; 
        res.render('main', {name: req.cookies.name, hash: req.query.room, admin: admin});
    }
    else
        res.send('인증되지 않은 사용자');
});

router.route('/makingRoom').get(function(req, res){
    res.render('makingRoom', {name: req.cookies.name});
});

router.route('/process/tryingmakeroom').post(function(req, res){
    let hash = roomManager.makingRoom(req.body.title, req.body.password, parseInt(req.body.maxPlayer));
    let key = roomManager.roomlist[hash].checkConnection(req.body.password).key;
    res.redirect(`/game?room=${hash}&key=${key}`);
});

router.route('/mapeditor').get(function(req, res){
    res.render('mapeditor');
});
exports.router = router;