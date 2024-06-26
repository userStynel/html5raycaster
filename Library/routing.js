var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');

router.route('/').get(function(req, res){
    res.render('enter', {session: req.session});
});

router.route('/lobby').get(function(req, res){
    var name = req.cookies.name;
    if(req.cookies.name) res.render(res.render('lobby', {name: name, roomList: roomManager.getRoomInfoList()}));
    else res.redirect('/');
});

router.route('/lobby').post(function(req, res){
    res.cookie('name', req.body.name);
    res.render('lobby', {name: req.body.name, roomList: roomManager.getRoomInfoList()});
});

router.route('/game').get(function(req, res){
    res.render('error');
});

router.route('/game').post(function(req, res){
    let admin = false;
    let hash = req.body.room;
    let key = req.body.key
    if(roomManager.roomList[hash] === undefined)
        res.render('error');
    else if(roomManager.roomList[hash].auth(key)){
        if(roomManager.roomList[hash].userCount == 0) admin = true; 
        res.render('main', {name: req.cookies.name, hash: hash, admin: admin});
    }
    else res.render('error');
});

router.route('/makingRoom').get(function(req, res){
    res.render('makingRoom', {name: req.cookies.name});
});

router.route('/process/tryingmakeroom').post(function(req, res){
    let hash = roomManager.makingRoom(req.body.title, req.body.password, parseInt(req.body.maxPlayer));
    let result_checkConnection =  roomManager.roomList[hash].checkConnection(req.body.password);
    let key = result_checkConnection.key;
    res.render('joinGame', {hash: hash, key: key});
});

router.route('/process/convertfile').post(function(req, res){ // in the heat of the night
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