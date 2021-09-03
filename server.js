var inc = 0;
global.inc = inc;

var user_list = {};
global.user_list = user_list;

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
var router = require('./Library/routing').router;
var map = require('./Library/init').map;
var sprite_map = require('./Library/init').sprite_map;
var sprites = require('./Library/init').sprites;
var AddUser = require('./Library/users').AddUser;
var DeleteUser = require('./Library/users').DeleteUser;
const userInfo  = require('./Library/userInfo').userInfo;
const Vector2 = require('./Library/userInfo').Vector2;
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
global.map = map;

server.listen(PORT, function(){
    console.log('server is on!');
});

io.on('connection', (socket)=>{
    let that_socket = socket;
    console.log('[LOG] new user is connected!');
    socket.on('firstJoin', (data)=>{
        let id = socket.id; let name = data.name;
        mappingNameToSocket[name] = socket; mappingSocketToName[id] = name;
        if(data.type == 'lobby'){
            socket.join('lobby');
            socket.emit('welcome-lobby', socket.id);
            socket.on('sendMSG', (text)=>{
                io.to('lobby').emit('MSG', {text: text});
            });
            socket.on('trying_join', (data)=>{
                let hash = data.hash
                let name = data.name;
                let password = data.password;
                let ret = roomManager.roomlist[hash].checkConnection(name, password);
                socket.emit('trying_join_result',{ret:ret, hash:data.hash});
            });
            socket.on('refresh', ()=>{
                socket.emit('refresh_complete', roomManager.serializeRoomList());
            });
        }
        else if(data.type == 'game'){
            roomManager.roomlist[data.hash].Join(id);
            socket.join(data.hash);
            io.to(data.hash).emit('user_coming', roomManager.roomlist[data.hash].serializeUL());
            socket.emit('welcome', {id:socket.id, playmode: roomManager.roomlist[data.hash].playMode});
            SOCKET_EVENTS(socket, data.hash);
        }
    });
})

function sendingUserData(){
    let ret = {};
    for(let id in user_list){
        let user = user_list[id];
        data = user.packing(); 
        ret[id] = data;
    }
    return ret;
}

function preupdate(){
    for(let id in user_list){
        let user = user_list[id];
        let socket = user.socket;
        socket.emit('pre_update');
    }
    update();
    // setTimeout(preupdate, 1000/32);
}
function update(){
    for(let id in user_list){
        let user = user_list[id];
        let socket = user_list[id].socket;
        user.processInput();
        user.processMouse();
        if(user.health < 0){
            let idd = socket.id;
            socket.disconnect();
            DeleteUser(idd);
        }
    }
    let ret = sendingUserData();
    for(let id in user_list){
        let socket = user_list[id].socket;
        socket.emit('update', ret);
    }
    
    //setTimeout(update, 1000/32);
}

// update();
// preupdate();

function wholeLOOP(){
    // preupdate();
    roomManager.CheckAndClean();
    roomManager.Process();
    setTimeout(wholeLOOP, 1000/32);
}

wholeLOOP();