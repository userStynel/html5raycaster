function ACTIVE_PREUPDATE_EVENT(){
    socket.on('pre_update', ()=>{
        socket.emit('keyBuffer', keyBuffer);
    })
}
function ACTIVE_UPDATE_EVENT(){
    socket.on('update', (game_status)=>{
        unpackGameStatus(game_status);
        update();
    })
}

function ACTIVE_KILL_EVENT(){
    socket.on('kill', (data)=>{
        let status = document.getElementById('status');
        let p = document.createElement('p');
        p.setAttribute('style', 'margin:0');
        p.textContent = `${data.murder} 🏹 ${data.victim}`;
        status.appendChild(p);
    });
}

function ACTIVE_GAMEOVER_EVENT(){
    socket.on('game_over', (user_list)=>{
        updateUserList(user_list);
    })
}

function ACTIVE_GAMERESULT_EVENT(){
    socket.on('game_result', (isRightWin)=>{
        if(isRightWin) alert('블루팀 승리!');
        else alert('레드팀 승리!');
    });
}


let INGAME_SOCKET_EVENTS = {
    pre_update: ACTIVE_PREUPDATE_EVENT,
    update: ACTIVE_UPDATE_EVENT,
    kill: ACTIVE_KILL_EVENT,
    game_over: ACTIVE_GAMEOVER_EVENT,
    game_result: ACTIVE_GAMERESULT_EVENT
};

function ACTIVE_INGAME_EVENT(){
    for(let event in INGAME_SOCKET_EVENTS)
        INGAME_SOCKET_EVENTS[event]();
}

function DISABLED_INGAME_EVENT(){
    for(let event in INGAME_SOCKET_EVENTS)
        socket.off(event)
}

function ADD_CLIENT_SOCKET_EVENT(){
    socket.on('welcome', (data)=>{
        playMode = data.playmode;
        map = data.map;
    });

    socket.on('game_start', (data)=>{
        setEmptyMapAndSpriteData();
        setEmptyImageData();
        setLoadingFalseAll();
        WIDTH = data.map_data.width;
        HEIGHT = data.map_data.height;
        map = data.map_data.map;
        for(let sp of data.map_data.sprites){
            sprites.push(new Sprite(NATURAL, sp.textureIDX, new Vector2(sp.pos.x, sp.pos.y)));
        }
        Loading_Image(data.map_data.wall_tiles, data.map_data.floor_tiles, data.map_data.sprite_tiles);
        unpackGameStatus(data.game_status);
        ACTIVE_INGAME_EVENT();
        playMode = true;
        isWaitMode = false;
        checkMode();
    });

    socket.on('game_finish', (user_list)=>{
        DISABLED_INGAME_EVENT();
        playMode = false;
        isWaitMode = true;
        checkMode();
        updateUserList(user_list);
    });

    socket.on('MSG', (data)=>{
        let chatbox  = document.getElementById('chatbox');
        let p = document.createElement('p');
        p.setAttribute('style', 'margin: 0px;')
        sender = data.sender;
        text = data.text;
        p.textContent = `${sender}: ${text}`;
        chatbox.appendChild(p);
        chatbox.scrollTop = chatbox.scrollHeight;
    });
    
    
    socket.on('disconnect', ()=>{
        game_ctx.fillRect(0, 0, game_canvas.width, game_canvas.height);
        alert('서버와의 연결이 끊어졌습니다!');
    })
    
    socket.on('room_deleted', ()=>{
        alert('방장이 도중에 나가 방이 삭제되었습니다');
        window.location.href = '/lobby';
    });
    
    socket.on('user_coming', (user_list)=>{
        updateUserList(user_list);
    });
    
    socket.on('user_leaving', (user_list)=>{
        updateUserList(user_list);
    });

    socket.on('unvalid_map_file', ()=>{
        alert('맵 파일을 읽을 수 없습니다!');
    })
}