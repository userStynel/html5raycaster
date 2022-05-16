function ADD_CLIENT_SOCKET_EVENT(){
    socket.on('welcome', (data)=>{
        playMode = data.playmode;
    });
    
    socket.on('pre_update', ()=>{
        if(keyBuffer != 0)
            socket.emit('keyBuffer', keyBuffer);
        // if(mouseBuffer.length != 0)
        //     socket.emit('mouseBuffer', mouseBuffer);
        keyBuffer = 0;
        keyBuffer2 = [];
        mouseBuffer = [];
    })
    
    socket.on('update', (data)=>{
        others = [];
        others_id = [];
        for(let id in ANIMATION_QUEUE){
            let ret = ANIMATION_QUEUE[id].update();
            if(!ret) delete ANIMATION_QUEUE[id];
        }
        for(let id in data){
            let d = data[id];
            if(id == socket.id){
                player.unpack(d);
            }
            else{
                others_id.push(id);
                others.push(new Sprite(2, new Vector2(d.pos.x, d.pos.y)));
            }
        }
        update();
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
    
    socket.on('kill', (data)=>{
        let status = document.getElementById('status');
        let p = document.createElement('p');
        p.setAttribute('style', 'margin:0');
        p.textContent = `${data.murder} 🏹 ${data.victim}`;
        status.appendChild(p);
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
    
    socket.on('game_start', (data)=>{
        playMode = true;
        isWaitMode = false;
        map = data.map;
        sprite_map = data.sprite_map;
        sprites.push(new Sprite(data.sprites.type, new Vector2(data.sprites.pos.x, data.sprites.pos.y)));
        checkMode();
        alert('게임 시작!');
        console.log(map);
    });
    
    socket.on('game_finish', ()=>{
        playMode = false;
        isWaitMode = true;
        checkMode();
    })
    
    socket.on('game_result', (isRightWin)=>{
        if(isRightWin) alert('블루팀 승리!');
        else alert('레드팀 승리!');
    });
    
    socket.on('gameover', (user_list)=>{
        updateUserList(user_list);
    })
}