socket.on('welcome', (data)=>{
    map = data.map;
    socketID = data.id;
    sprite_map = data.sprite_map;
    sprites.push(new Sprite(data.sprites.type, new Vector2(data.sprites.pos.x, data.sprites.pos.y)));
    Init();
});

socket.on('pre_update', ()=>{
    if(keyBuffer2.length != 0)
        socket.emit('keyBuffer', keyBuffer2);
    if(mouseBuffer.length != 0)
        socket.emit('mouseBuffer', mouseBuffer);
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
            player.pos = new Vector2(d.pos.x, d.pos.y);
            player.angle = d.angle;
            player.fov = d.fov;
            player.velocity = d.velocity;
            player.angular_velocity = d.angular_velocity;
            player.health = d.health;
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