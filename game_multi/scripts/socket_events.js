socket.on('welcome', (data)=>{
    socketID = data.id;
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
        if(id == socketID){
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
    console.log(chatbox.scrollTop, chatbox.scrollHeight);
});

socket.on('kill', (data)=>{
    let sincegoup = document.getElementById('sincegoup');
    let p = document.createElement('p');
    p.setAttribute('style', 'margin:0');
    p.textContent = `${data.murder} 🏹 ${data.victim}`;
    sincegoup.appendChild(p);
});

socket.on('disconnect', (data)=>{
    game_ctx.fillRect(0, 0, game_canvas.width, game_canvas.height);
})

socket.on('room_deleted', ()=>{
    alert('insommnia');
});

socket.on('user_coming', (user_list)=>{
    updateUserList(user_list);
});

socket.on('user_leaving', (user_list)=>{
    updateUserList(user_list);
});

socket.on('game_start', (data)=>{
    console.log('game is comming...');
    playMode = true;
    map = data.map;
    sprite_map = data.sprite_map;
    sprites.push(new Sprite(data.sprites.type, new Vector2(data.sprites.pos.x, data.sprites.pos.y)));
    alert('game start!');
});

socket.on('game_finish', ()=>{
    playMode = false;
    alert('game finished!');
})

socket.socket('game_result', (isRightWin)=>{
    if(isRightWin) alert('Right Team Win');
    else alert('Left Team Win');
});

socket.on('gameover', (user_list)=>{
    updateUserList(user_list);})

