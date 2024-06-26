const Initial_GameSetting = require('./init').Initial_GameSetting;
const Vector2  = require('./userInfo').Vector2;
const fs = require("fs");
const path = require("path");

function SOCKET_EVENTS(socket, hash){
    let room = roomManager.roomList[hash];
    
    socket.on('input', (data)=>{
        let hash = data.hash;
        let key = data.key;
        if(hash == NULL)
            user_list[socket.id].keyBuffer = key;
        else{
            RoomList[hash].users[socket.id].keyBuffer = key;
        }
    });

    socket.on('disconnect', (reason)=>{
        if(roomManager.roomList[hash]){
            roomManager.roomList[hash].leave(socket.id);
            io.to(hash).emit('user_leaving', roomManager.roomList[hash].getUserList());
        }
        let name = mapSocketToUserName[socket.id];
        delete mapSocketToUserName[name]; 
        delete mapUserNameToSocket[socket.id];
    });

    socket.on('sendMSG', (text)=>{
        io.to(hash).emit('MSG', {sender: room.users[socket.id].name, text: text});
    });

    socket.on('shoot', (target)=>{
        let user_list = room.users;
        if(target != 0 && typeof user_list[target] != 'undefined' && user_list[target].health > 0){
            user_list[target].health -= Math.ceil(Math.random()*10);
            if(user_list[target].health <= 0){
                let murder_name = user_list[socket.id].name;
                let victim_name = user_list[target].name;
                io.to(hash).emit('kill', {murder: murder_name, victim: victim_name});
            }
        }
    })

    socket.on('keyBuffer', (data)=>{
        //let hash = data.hash;
        let kb = data;
        if(hash == null)
            room.users[socket.id].keyBuffer = kb;
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

    socket.on('click_game_start', (data)=>{
        let map_data;
        let game_status
        if(data.defaultMap == false){
            map_data = data.data;
            if(map_data == undefined)
            {
                socket.emit('unvalid_map_file');
                return;
            }
        }
        else if(data.defaultMap == true){
            let idx = data.idx+1;
            map_data = JSON.parse(fs.readFileSync(path.resolve(__dirname, `../map/defaultmap${idx}.json`)));
            console.log(path.resolve(__dirname, `../map/defaultmap${idx}.json`));
        }
        game_status = Initial_GameSetting(roomManager.roomlist[hash], map_data);
        roomManager.roomlist[hash].playMode = true;
        io.to(hash).emit('game_start', {map_data:map_data, game_status: game_status});
    });

    socket.on('click_game_broken', ()=>{
        roomManager.roomlist[hash].playMode = false;
        io.to(hash).emit('game_finish', roomManager.roomlist[hash].serializeUL());
    })
}

exports.SOCKET_EVENTS = SOCKET_EVENTS;