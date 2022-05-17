const R = 0;
const G = 1;
const B = 2;
const A = 3;

function Render_FloorAndCeil(me){
    let pos = me.pos;
    let angle = me.angle;
    let fov = me.fov
    let size = 1;
    let a =  new Vector2(1, 0).rotate(angle-fov/2);
    let b =  new Vector2(1, 0).rotate(angle+fov/2);

    for(let y = game_canvas.height; y >= h/2; y-= size){      
        let rawDistance = (game_canvas.height/2) / ((game_canvas.height - y) - game_canvas.height/2);
        let aa =  a.mul(rawDistance);
        let bb =  b.mul(rawDistance);
        let start = pos.add(aa);     
        let step = bb.sub(aa).mul(1/game_canvas.width);
        for(let x = 0; x<game_canvas.width; x+= size){
            let floorX = start.x; let floorY = start.y;
            let CellX = start.x | 0; let CellY = start.y | 0;

            let tx = ((64 * (floorX - CellX)) | 0) & (63);
            let ty = ((64 * (floorY - CellY)) | 0) & (63);
            start = start.add(step);

            let idx = 4 * (game_canvas.width * y + x);
            let texidx = tx + 64 * ty;
            
            buffer[idx + 0] = data_floor[0][texidx][R];
            buffer[idx + 1] = data_floor[0][texidx][G];
            buffer[idx + 2] = data_floor[0][texidx][B];
            buffer[idx + 3] = data_floor[0][texidx][A];
        }
    }
}

function Render_Weapon(){
    game_ctx.drawImage(wp_img, (game_canvas.width - wp_img.width)/2, game_canvas.height - wp_img.height);
}

function Render_Wall(player){
    for(let i = 0; i< player.rays.length; i++){
        let lay = player.rays[i];
        let height = Math.abs(h / lay.perpWallDist);
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
            let idx = 4 * (game_canvas.width * y + i);
            let texidx = (((lay.hitWallTexcoordX * img_wall[lay.hitWallTextureType-1].width) | 0) + 64 * (texY | 0));
            buffer[idx + 0] = data_wall[lay.hitWallTextureType-1][texidx][R];
            buffer[idx + 1] = data_wall[lay.hitWallTextureType-1][texidx][G];
            buffer[idx + 2] = data_wall[lay.hitWallTextureType-1][texidx][B];
            buffer[idx + 3] = data_wall[lay.hitWallTextureType-1][texidx][A];
       }
    }
}

function Render_Sprite(me){
    let pos = me.pos;
    let angle = me.angle;
    let fov = me.fov
    
    let dir =  new Vector2(1, 0).rotate(angle);
    let plane = new Vector2(0, Math.tan(fov/2)).rotate(angle);
    let ou = sprites.concat(others);
    
    // 플레이어와 거리가 먼 순서대로 정렬
    ou = ou.sort((a, b) => {
        let distanceA = ((pos.x - a.pos.x)*(pos.x - a.pos.x) + (pos.y - a.pos.y)*(pos.y - a.pos.y));
        let distanceB = ((pos.x - b.pos.x)*(pos.x - b.pos.x) + (pos.y - b.pos.y)*(pos.y - b.pos.y));
        return (distanceA < distanceB);
    });
    
    for(let i = 0; i<ou.length; i++)
    {
        let textureType = ou[i].type;
        let spriteX = ou[i].pos.x-pos.x; 
        let spriteY = ou[i].pos.y-pos.y;
        
        let invDet = 1.0 / (plane.x * dir.y - dir.x * plane.y);
        
        let transformX = invDet * (dir.y * spriteX - dir.x * spriteY);
        let transformY = invDet * (-plane.y * spriteX + plane.x * spriteY); 
        
        let spriteScreenX = parseInt((game_canvas.width / 2) * (1 + transformX / transformY));
        let spriteHeight = Math.abs(parseInt((h) / (transformY)))*1.05;
        
        if(transformY < 0) continue;
        let drawStartY = (-spriteHeight / 2 + h / 2) | 0;
        if(drawStartY < 0) drawStartY = 0;
        let drawEndY = (spriteHeight / 2 + h / 2) | 0;
        if(drawEndY >= h) drawEndY = h - 1;

        let spriteWidth = Math.abs(parseInt ((h) / (transformY)))*1.05;
        let drawStartX = -spriteWidth / 2 + spriteScreenX;
        rdrawStartX = drawStartX | 0;
        if(drawStartX < 0) rdrawStartX = 0;
        let drawEndX = spriteWidth / 2 + spriteScreenX;
        rdrawEndX = drawEndX | 0;
        if(drawEndX >= game_canvas.width) rdrawEndX = game_canvas.width - 1;

        for(let x = rdrawStartX; x<=rdrawEndX; x++){
            if(zBuffer[x] < transformY) continue;
            let ratioA = (x - drawStartX) / (drawEndX - drawStartX);
            for(let y = drawStartY; y<=drawEndY; y++){
                let ratioB = (y - drawStartY) / (drawEndY - drawStartY);
                let idx = 4 * (game_canvas.width * y + x);
                let tx = (img_sprite[textureType-1].width * ratioA | 0) & (63);
                let ty = (img_sprite[textureType-1].height * ratioB | 0) & (63);
                let texidx = ty * 64 + tx
                if( data_sprite[textureType-1][texidx][3] == 0) continue;
                buffer[idx + 0] = data_sprite[textureType-1][texidx][R];
                buffer[idx + 1] = data_sprite[textureType-1][texidx][G];
                buffer[idx + 2] = data_sprite[textureType-1][texidx][B];
                buffer[idx + 3] = data_sprite[textureType-1][texidx][A];
            }
        }
    }
}

function Render_Game(me){
    game_ctx.fillStyle = "pink";
    game_ctx.fillRect(0, 0, game_canvas.width, game_canvas.height);
    g = game_ctx.getImageData(0, 0, game_canvas.width, game_canvas.height);
    buffer = g.data;
    Render_FloorAndCeil(player);
    Render_Wall(player);
    Render_Sprite(player);
    game_ctx.putImageData(g, 0, 0);
    Render_Weapon();
}