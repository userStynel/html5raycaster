var player = new Player(new Vector2(3, 2));

function Loading_Wall(idx){
    if(idx == wall_length){
        console.log("Loading Wall Images finished...")
        wall_loaded = true;
    }
    else{
        let i = idx;
        let img = new Image();
        img.src = `./texture/wall_${idx+1}.png`;
        img.onload = () => {
            img_wall.push(img);
            let temp = document.createElement('canvas');
            let tempctx = temp.getContext('2d');
            temp.width = img.width; temp.height = img.height;
            tempctx.drawImage(img, 0, 0);
            let imgd = tempctx.getImageData(0, 0, img.width, img.height).data;
            var rgbArray = new Array(img.width * img.height);
            for(let p = 0; p<img.width*img.height; p++){
                rgbArray[p] = [imgd[4*p], imgd[4*p+1], imgd[4*p+2], imgd[4*p+3]];
            }
            console.log(imgd);
            console.log(rgbArray);
            data_wall.push(rgbArray);
            Loading_Wall(i+1);
        }
    }
}

function Loading_Floor(idx){
    if(idx == floor_length){
        console.log("Loading Floor Images finished...")
        floor_loaded = true;
    }
    else{
        let i = idx;
        let img = new Image();
        img.src = `./texture/floor_${idx+1}.png`;
        img.onload = () => {
            img_floor.push(img);
            let temp = document.createElement('canvas');
            let tempctx = temp.getContext('2d');
            temp.width = img.width; temp.height = img.height;
            tempctx.drawImage(img, 0, 0);
            let imgd = tempctx.getImageData(0, 0, img.width, img.height).data;
            var rgbArray = new Array(img.width * img.height);
            for(let p = 0; p<img.width*img.height; p++){
                rgbArray[p] = [imgd[4*p], imgd[4*p+1], imgd[4*p+2], imgd[4*p+3]];
            }
            data_floor.push(rgbArray);
            Loading_Floor(i+1);
        }
    }
}

function Loading_Sprite(idx){
    if(idx == sprite_length){
        console.log("Loading Sprite Images finished...")
        sprite_loaded = true;
    }
    else{
        let i = idx;
        let img = new Image();
        img.src = `./texture/sprite_${idx+1}.png`;
        img.onload = () => {
            img_sprite.push(img);
            let temp = document.createElement('canvas');
            let tempctx = temp.getContext('2d');
            temp.width = img.width; temp.height = img.height;
            tempctx.drawImage(img, 0, 0);
            let imgd = tempctx.getImageData(0, 0, img.width, img.height).data;
            var rgbArray = new Array(img.width * img.height);
            for(let p = 0; p<img.width*img.height; p++){
                rgbArray[p] = [imgd[4*p], imgd[4*p+1], imgd[4*p+2], imgd[4*p+3]];
            }
            data_sprite.push(rgbArray);
            Loading_Sprite(i+1);
        }
    }
}

function Loading_Image(){
    let img = new Image();
    let img2 = new Image();
    img.src = './texture/gun.png';
    img.onload = () => {
        gun_loaded = true;
        wp_img = img;
        img_gun = img;
    }
    img2.src = './texture/knife.png';
    img2.onload = () => {
        knife_loaded = true;
        img_knife = img2;
    }
    Loading_Wall(0);
    Loading_Sprite(0);
    Loading_Floor(0);
}

function IsImageFileLoaded(){
    //console.log(wall_loaded, sprite_loaded, gun_loaded);
    return (wall_loaded && sprite_loaded && gun_loaded && floor_loaded && knife_loaded);
}

function Init(){
    Loading_Image(0);
    map_canvas.width = WIDTH * SIZE;
    map_canvas.height = HEIGHT * SIZE;

    game_canvas.width = 15 * 40;
    game_canvas.height = 600;

    g = game_ctx.getImageData(0, 0, game_canvas.width, game_canvas.height);
    buffer = g.data;
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

function DrawGame(){
    // let g = game_ctx.getImageData(0, 0, game_canvas.width, game_canvas.height);
    // let buffer = g.data;
    for(let i = 0; i< player.Rays.length; i++){
        let lay = player.Rays[i];
        let perpWallDist = lay.perpWallDist;
        let wallX = lay.wallX;
        let type = lay.type;
        let height = Math.abs(h / perpWallDist);
        var drawStart = ((h - height) / 2) | 0;
        var drawEnd = ((h + height) / 2) | 0;
        if(drawStart < 0) 
          drawStart = 0;
        if(drawEnd >= h)
            drawEnd = h-1;
       for(let y = drawStart; y<drawEnd; y++){
        let d = (y * 256 - h * 128 + height * 128) | 0;
        let texY = ( d * 64/ (height * 256))/* | 0*/;
        if (texY < 0) texY = 0;
        // console.log(texY);
        let idx = 4 * (game_canvas.width * y + i);
        let texidx = (((wallX * img_wall[type-1].width)|0) + 64 * (texY | 0));
        // console.log(i, texidx, ((wallX * img_wall[2].width)|0), (texY | 0));
        buffer[idx + 0] = data_wall[type-1][texidx][0];
        buffer[idx + 1] = data_wall[type-1][texidx][1];
        buffer[idx + 2] = data_wall[type-1][texidx][2];
        buffer[idx + 3] = data_wall[type-1][texidx][3];
        // game_ctx.fillStyle = "yellow";
        // game_ctx.fillRect(i, y, 1, 1);
       }
    }
    // game_ctx.putImageData(g, 0, 0);
}

function draw(){
    DrawMap();
    DrawGame();
    player.draw();
}

function update(){
    if(IsImageFileLoaded()){
        game_ctx.fillStyle = "pink";
        game_ctx.fillRect(0, 0, game_canvas.width, game_canvas.height);
        g = game_ctx.getImageData(0, 0, game_canvas.width, game_canvas.height);
        buffer = g.data;
        player.update();
        Render_FloorAndCeil(player);
        draw();
        Render_Sprite(player);
        game_ctx.putImageData(g, 0, 0);
        Render_Weapon();
        hpbar.setAttribute('style', `--width:${player.health}`);
    }
    else{
        console.log("Loading Images...");
    }
}

// Init();
// update();
