var inc = 0;
global.inc = inc;

var user_list = {};
global.user_list = user_list;

var express = require('express');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
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

var app = express();
const PORT = process.env.PORT || 3000;

app.set('views', __dirname+'/game_multi/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.set('port', PORT);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(static(__dirname+'/game_multi'));
app.use('/', router);

var server = http.createServer(app);
var io = require('socket.io')(server);

server.listen(PORT, function(){
    console.log('server is on!');
});

io.on('connection', (socket)=>{
    console.log('[LOG] new user is connected!');
    socket.emit('welcome', {map: map, sprite_map: sprite_map, sprites: sprites[0].serialize(), id: socket.id});
    SOCKET_EVENTS(socket);
})

function sendingUserData(){
    let ret = {};
    for(let id of Object.keys(user_list)){
        let user = user_list[id];
        let data = {
            health: user.health,
            angle: user.angle,
            pos: {x: user.pos.x, y: user.pos.y},
            fov: user.fov,
            velocity: user.velocity,
            angular_velocity: user.angular_velocity
        };
        ret[id] = data;
    }
    return ret;
}

function preupdate(){
    io.emit('pre_update', update());
    setTimeout(preupdate, 1000/32);
}
function update(){
    for(let id of Object.keys(user_list)){
        let user = user_list[id];
        let socket = user_list[id].socket;
        user.processInput2();
        if(user.health < 0){
            let idd = socket.id;
            socket.disconnect();
            DeleteUser(idd);
        }
    }
    let ret = sendingUserData();
    for(let id of Object.keys(user_list)){
        let socket = user_list[id].socket;
        socket.emit('update', ret);
    }
    
    //setTimeout(update, 1000/32);
}

// update();
preupdate();