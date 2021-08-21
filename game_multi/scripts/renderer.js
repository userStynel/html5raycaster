function Render_FloorAndCeil(me){
    let pos = me.pos;
    let angle = me.angle;
    let fov = me.fov
    let size = 1;
    let a =  new Vector2(1, 0).rotate(angle-fov/2)
    let b =  new Vector2(1, 0).rotate(angle+fov/2)

    // let g = game_ctx.getImageData(0, 0, game_canvas.width, game_canvas.height);
    // let buffer = g.data;

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

            // game_ctx.drawImage(img_floor[0], tx-size/2, ty-size/2, size, size, x, y, size, size);
            let idx = 4 * (game_canvas.width * y + x);
            let texidx = tx + 64 * ty;
            // console.log(y, texidx, tx, ty, floorX, CellX, floorY, CellY);
            buffer[idx + 0] = data_floor[0][texidx][0];
            buffer[idx + 1] = data_floor[0][texidx][1];
            buffer[idx + 2] = data_floor[0][texidx][2];
            buffer[idx + 3] = data_floor[0][texidx][3];
        }
    }
    // game_ctx.putImageData(g, 0, 0);
}

function Render_Weapon(){
    game_ctx.drawImage(wp_img, (game_canvas.width - wp_img.width)/2, game_canvas.height - wp_img.height);
}

function Render_Sprite(me){
    let pos = me.pos;
    let angle = me.angle;
    let fov = me.fov
    
    let dir =  new Vector2(1, 0).rotate(angle);
    let plane = new Vector2(0, Math.tan(fov/2)).rotate(angle);
    let ou = sprites.concat(others);
    // let g = game_ctx.getImageData(0, 0, game_canvas.width, game_canvas.height);
    // let buffer = g.data;
    
    for(let i = 0; i<ou.length; i++)
    {
        let type = ou[i].type;
        let spriteX = ou[i].pos.x-pos.x, spriteY = ou[i].pos.y-pos.y;
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

        // drawEndY += 32; drawStartY += 32

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
            // game_ctx.drawImage(img_sprite[type-1], img_sprite[type-1].width * ratioA, 0, 1, img_sprite[type-1].height,
            //     x, drawStartY, 1, drawEndY-drawStartY);
            for(let y = drawStartY; y<=drawEndY; y++){
                let ratioB = (y - drawStartY) / (drawEndY - drawStartY);
                let idx = 4 * (game_canvas.width * y + x);
                let tx = (img_sprite[type-1].width * ratioA | 0) & (63);
                let ty = (img_sprite[type-1].height * ratioB | 0) & (63);
                let texidx = ty * 64 + tx
                if( data_sprite[type-1][texidx][3] == 0) continue;
                buffer[idx + 0] = data_sprite[type-1][texidx][0];
                buffer[idx + 1] = data_sprite[type-1][texidx][1];
                buffer[idx + 2] = data_sprite[type-1][texidx][2];
                buffer[idx + 3] = data_sprite[type-1][texidx][3];
            }
        }
    }
    // game_ctx.putImageData(g, 0, 0);
}