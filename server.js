var mapSocketIDToUserName = {};

var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var static = require('serve-static');

const FPS = 32;
const router = require('./Library/routing').router;
const SOCKET_EVENTS = require('./Library/socketEvents').SOCKET_EVENTS;
const RoomManager = require('./Library/roomManager').RoomManager;

var app = express();
var roomManager = new RoomManager();

const PORT = process.env.PORT || 3000;

app.set('views', __dirname+'/game_multi/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.set('port', PORT);

app.use(static(__dirname+'/game_multi'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(cookieParser());
app.use('/', router);

var server = http.createServer(app);
var io = require('socket.io')(server);

global.io = io;
global.roomManager = roomManager;
global.mapSocketIDToUserName = mapSocketIDToUserName;

function wholeLOOP(){
    roomManager.checkAndCleanEmptyRoom();
    roomManager.process();
    setTimeout(wholeLOOP, 1000/FPS);
}

server.listen(PORT, function(){
    console.log('server is on!');
    wholeLOOP();
    console.log('room manager is running!');
});

io.on('connection', (socket)=>{
    socket.on('client_joined_lobby', (data)=>{
        mapSocketIDToUserName[socket.id] = data.userName;
        socket.on('trying_connect_room_request', (data)=>{ /*data: {roomHash: string, roomPassword: string} */
            let result = roomManager.roomList[data.roomHash].checkConnection(data.roomPassword);
            socket.emit('trying_connect_room_response',{result:result, roomHash:data.roomHash});
        });
        socket.on('refresh_roomlist_request', ()=>{
            socket.emit('refresh_roomlist_response', roomManager.getRoomInfoList());
        });
    });
    socket.on('client_make_room', (data) => {
        let roomHash = data.roomHash;
        //roomManager.roomList[roomHash] = 
    });
})
