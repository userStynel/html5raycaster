var anim;

function Init(){
    Loading_Image(0);
    Loading_ANIMATION();
    
    map_canvas.width = WIDTH * SIZE;
    map_canvas.height = HEIGHT * SIZE;

    game_canvas.width = 15 * 40;
    game_canvas.height = 600;
    
    g = game_ctx.getImageData(0, 0, game_canvas.width, game_canvas.height);
    buffer = g.data;

    ADD_CLIENT_WINDOW_EVENT();
    ADD_CLIENT_SOCKET_EVENT();

    checkMode();
    socket.emit('firstJoin', {type:'game', hash: hash, name:name});
}

function DrawMap(){
    map_ctx.clearRect(0, 0, map_canvas.width, map_canvas.height);
    // let colors = ["black", "blue", "green", "yellow", "purple"]; 
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

function draw(){
    DrawMap();
    player.draw();
}

function update(){
    if(IsImageFileLoaded()){
        player.update();
        draw();
        Render_Game(player);
        hpbar.setAttribute('style', `--width:${player.health}`);
    }
    else{
        console.log("Loading Images...");
    }
}

