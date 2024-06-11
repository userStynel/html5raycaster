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

app.set('views', __dirname+'/game/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.set('port', PORT);

app.use(static(__dirname+'/game'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(cookieParser());
app.use('/', router);

var server = http.createServer(app);
var io = require('socket.io')(server);

global.io = io;
global.roomManager = roomManager;
global.mapSocketIDToUserName = mapSocketIDToUserName;

server.listen(PORT, function(){
    console.log('server is on!');
});

io.on('connection', (socket)=>{
    socket.on('client_joined_lobby', (data)=>{
        mapSocketIDToUserName[socket.id] = data.userName;
        socket.on('trying_connect_room_request', (data)=>{ /*data: {roomHash: string, roomPassword: string} */
            let roomHash = data.roomHash;
            roomManager.roomList[roomHash].socket.emit('want_to_join', sdpOffer);
        });
        socket.on('answer_from_server', (data) => { // master -> client
            
        });
        socket.on('refresh_roomlist_request', ()=>{
            socket.emit('refresh_roomlist_response', roomManager.getRoomInfoList());
        });
    });
    socket.on('make_room', (data) => {
        console.log("server::56::", data);
        let roomHash = data.roomHash;
        roomManager.roomList[roomHash].socket = socket;
    });
    socket.on('send-offer', (data)=>{
        console.log("server::61::", data);
    })
});