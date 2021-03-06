var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');

router.route('/').get(function(req, res){
    res.render('enter', {session: req.session});
});

router.route('/lobby').post(function(req, res){
    res.cookie('name', req.body.name);
    res.render('lobby', {name: req.body.name, roomList: roomManager.serializeRoomList()});
});

router.route('/game').get(function(req, res){
    let admin = false;
    let hash = req.query.room;
    let key = req.query.key
    if(roomManager.roomlist[hash] === undefined)
        res.render('error');
    else if(roomManager.roomlist[hash].auth(key)){
        if(roomManager.roomlist[hash].userCount == 0) admin = true; 
        res.render('main', {name: req.cookies.name, hash: req.query.room, admin: admin});
    }
    else if(roomManager.roomlist[hash].password == ''){
        res.render('main', {name: req.cookies.name, hash: req.query.room, admin: admin});
    }
    else res.render('error');
});

router.route('/makingRoom').get(function(req, res){
    res.render('makingRoom', {name: req.cookies.name});
});

router.route('/process/tryingmakeroom').post(function(req, res){
    let hash = roomManager.makingRoom(req.body.title, req.body.password, parseInt(req.body.maxPlayer));
    let key = roomManager.roomlist[hash].checkConnection(req.body.password).key;
    res.redirect(`/game?room=${hash}&key=${key}`);
});

router.route('/process/convertfile').post(function(req, res){
    let filename = req.body.filename
    let data = req.body.data;
    if(data != undefined){
        fs.writeFile(`./temp/${filename}.json`, data, (err)=>{
            if(err) throw err;
            res.download(path.resolve(`./temp/${filename}.json`), `${filename}.json`);
        });
    }
});
router.route('/mapeditor').get(function(req, res){
    res.render('mapeditor');
});
exports.router = router;