function init(){
    game_canvas.width = 15 * 40;
    game_canvas.height = 600;
    
    g = game_ctx.getImageData(0, 0, game_canvas.width, game_canvas.height);
    buffer = g.data;

    ADD_CLIENT_WINDOW_EVENT();
    ADD_CLIENT_SOCKET_EVENT();

    checkMode();
    socket.emit('firstJoin', {type:'game', hash: hash, name:name});
}

function drawMap(){
    map_ctx.clearRect(0, 0, map_canvas.width, map_canvas.height);
    for(let y = 0; y<HEIGHT; y++){
        for(let x = 0; x<WIDTH; x++){
            if(map[y][x] >= 1) map_ctx.fillStyle = WALL_COLOR;
            else if(!(sprite_map[y][x] === undefined || sprite_map[y][x] == null)) map_ctx.fillStyle = "green";
            else map_ctx.fillStyle = GROUND_COLOR;
            // ctx.fillStyle = colors[(y*WIDTH + x) % colors.length];
            map_ctx.fillRect(x*SIZE, y*SIZE, SIZE, SIZE);
        }
    }
}

function unpackGameStatus(gameStatus){
    others = [];
    let idx = 0;
    while(gameStatus[idx] != undefined){
        let status = gameStatus[idx];
        if(status.id == socket.id){
            player.unpack(status.data);
        }
        else{
            others.push({id:status.id, pos:new Vector2(status.data.pos.x, status.data.pos.y)});
        }
        idx += 1;
    }
}
        
function update(){
    if(isImageFileLoaded()){
        player.update();
        Render_Game();
        hpbar.setAttribute('style', `--width:${player.health}`);
    }
}

