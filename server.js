var mappingSocketToName = {};
global.mappingSocketToName = mappingSocketToName;
var mappingNameToSocket = {};
global.mappingNameToSocket = mappingNameToSocket;

var express = require('express');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var static = require('serve-static');

/*
var map = require('./Library/init').map;
var sprite_map = require('./Library/init').sprite_map;
var sprites = require('./Library/init').sprites;
*/

const router = require('./Library/routing').router;
const SOCKET_EVENTS = require('./Library/socketEvents').SOCKET_EVENTS;
const RoomManager = require('./Library/roomManager').RoomManager;

var app = express();
var roomManager = new RoomManager();
global.roomManager = roomManager;

const PORT = process.env.PORT || 3000;

app.set('views', __dirname+'/game_multi/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.set('port', PORT);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(cookieParser());
app.use(static(__dirname+'/game_multi'));
app.use('/', router);

var server = http.createServer(app);
var io = require('socket.io')(server);

global.io = io;


server.listen(PORT, function(){
    console.log('server is on!');
});

io.on('connection', (socket)=>{
    socket.on('firstJoin', (data)=>{
        mappingNameToSocket[data.name] = socket; 
        mappingSocketToName[socket.id] = data.name;
        if(data.type == 'lobby'){
            socket.join('lobby');
            socket.on('sendMSG', (text)=>{
                io.to('lobby').emit('MSG', {text: text});
            });
            socket.on('trying_connect_room_request', (data)=>{
                let ret = roomManager.roomlist[data.hash].checkConnection(data.password);
                socket.emit('trying_connect_room_response',{ret:ret, hash:data.hash});
            });
            socket.on('refresh_roomlist_request', ()=>{
                socket.emit('refresh_roomlist_response', roomManager.serializeRoomList());
            });
        }
        else if(data.type == 'game'){
            roomManager.roomlist[data.hash].Join(socket.id);
            socket.join(data.hash);
            io.to(data.hash).emit('user_coming', roomManager.roomlist[data.hash].serializeUL());
            socket.emit('welcome', {id:socket.id, playmode: roomManager.roomlist[data.hash].playMode, map:roomManager.roomlist[data.hash].map});
            SOCKET_EVENTS(socket, data.hash);
        }
    });
})

function wholeLOOP(){
    roomManager.CheckAndClean();
    roomManager.Process();
    setTimeout(wholeLOOP, 1000/32);
}

wholeLOOP();