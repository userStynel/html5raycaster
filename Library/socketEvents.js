const Init_GameSetting = require('./init').Init_GameSetting;
const Vector2  = require('./userInfo').Vector2;
const userInfo  = require('./userInfo').userInfo;
var AddUser = require('./users').AddUser;
var DeleteUser = require('./users').DeleteUser;
var map = require('./init').map;
var sprite_map = require('./init').sprite_map;
var sprites = require('./init').sprites;

function SOCKET_EVENTS(socket, hash){
    let room = roomManager.roomlist[hash];
    socket.on('input', (data)=>{
        let hash = data.hash;
        let key = data.key;
        console.log('inputed', key);
        if(hash == NULL)
            user_list[socket.id].keyBuffer = key;
        else{
            RoomList[hash].users[socket.id].keyBuffer = key;
        }
    });

    socket.on('disconnect', (reason)=>{
        console.log('disconnected');
        if(roomManager.roomlist[hash]){
            roomManager.roomlist[hash].Leave(socket.id);
            io.to(hash).emit('user_leaving', roomManager.roomlist[hash].serializeUL());
        }
        let name = mappingSocketToName[socket.id];
        delete mappingNameToSocket[name]; 
        delete mappingSocketToName[socket.id];
    });

    socket.on('sendMSG', (text)=>{
        io.to(hash).emit('MSG', {sender: room.users[socket.id].name, text: text});
    });
    socket.on('shoot', (msg)=>{
        let user_list = room.users;
        if(msg != 0 && typeof user_list[msg] != 'undefined' && user_list[msg].health > 0){
            user_list[msg].health -= Math.ceil(Math.random()*10);
            if(user_list[msg].health <= 0){
                let murder_name = user_list[socket.id].name;
                let victim_name = user_list[msg].name;
                io.to(hash).emit('kill', {murder: murder_name, victim: victim_name});
            }
        }
    })
    socket.on('keyBuffer', (data)=>{
        //let hash = data.hash;
        let kb = data;
        if(hash == null)
            room.users[socket.id].keyBuffer= kb;
        else{
            room.users[socket.id].keyBuffer = kb;
        }
    })
    socket.on('mouseBuffer', (data)=>{
        //let hash = data.hash;
        let mb = data;
        if(hash == NULL)
            room.users[socket.id].keyBuffer= mb;
        else{
            room.users[socket.id].mouseBuffer = mb;
        }
    });

    socket.on('move-team', (data)=>{
        roomManager.roomlist[hash].users[socket.id].team = data;
        let first = false;
        if(roomManager.roomlist[hash].playMode){
            if(room.users[socket.id].pos == null) first = true;
            if(data == 1)
                room.users[socket.id].pos = new Vector2(5, 5);
            else if(data == 2)
                room.users[socket.id].pos = new Vector2(15, 15);
            else if(data == 0)
                room.users[socket.id].pos = null;
            if(first){
                socket.emit('game_start', {
                    map: map,
                    sprite_map: sprite_map,
                    sprites: sprites[0].serialize()
                });
            }
        }
        io.to(hash).emit('user_coming', roomManager.roomlist[hash].serializeUL());
    });

    socket.on('click_game_start', ()=>{
       let data = Init_GameSetting(hash);
       roomManager.roomlist[hash].playMode = true;
       io.to(hash).emit('game_start', data);
    });

    socket.on('click_game_broken', ()=>{
        roomManager.roomlist[hash].playMode = false;
        io.to(hash).emit('game_finish', '');
    })
}
exports.SOCKET_EVENTS = SOCKET_EVENTS;