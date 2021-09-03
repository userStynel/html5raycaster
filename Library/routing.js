var express = require('express');
const { RoomManager } = require('./roomManager');
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
    if(!roomManager.roomlist[hash].avoid(req.cookies.name)){
        let admin = false;
        if(roomManager.roomlist[hash].userCount == 0) admin = true; 
        res.render('main', {name: req.cookies.name, hash: req.query.room, admin: admin});
    }
    else
        res.redirect('/');
});

router.route('/makingRoom').get(function(req, res){
    res.render('makingRoom', {name: req.cookies.name});
});

router.route('/process/tryingmakeroom').post(function(req, res){
    console.log(req.body.password);
    let hash = roomManager.makingRoom(req.body.title, req.body.password, parseInt(req.body.maxPlayer), req.cookies.name);
    res.redirect(`/game?room=${hash}`);
});

exports.router = router;