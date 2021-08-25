const Vector2  = require('./userInfo').Vector2;
const userInfo  = require('./userInfo').userInfo;
var AddUser = require('./users').AddUser;
var DeleteUser = require('./users').DeleteUser;

function SOCKET_EVENTS(socket){
    socket.on('join_lobby', (data)=>{
        AddUser(socket, new userInfo(data, new Vector2(10, 7), socket));
    })
    socket.on('input', (key)=>{
        console.log('inputed', key);
        user_list[socket.id].keyBuffer = key;
    });
    socket.on('disconnect', (reason)=>{
        console.log('disconnected');
        DeleteUser(socket.id);
    });
    socket.on('sendMSG', (text)=>{
        io.emit('MSG', {sender: user_list[socket.id].name, text: text});
    });
    socket.on('shoot', (msg)=>{
        if(msg != 0 && typeof user_list[msg] != 'undefined' && user_list[msg].health > 0){
            user_list[msg].health -= Math.ceil(Math.random()*10);
            if(user_list[msg].health <= 0){
                let murder_name = user_list[socket.id].name;
                let victim_name = user_list[msg].name;
                io.emit('kill', {murder: murder_name, victim: victim_name});
            }
        }
    })
    socket.on('keyBuffer', (kb)=>{
        user_list[socket.id].keyBuffer= kb;
    })
    socket.on('mouseBuffer', (mb)=>{
        user_list[socket.id].mouseBuffer = mb;
    });
}
exports.SOCKET_EVENTS = SOCKET_EVENTS;