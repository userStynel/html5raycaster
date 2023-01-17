function Render_FloorAndCeil(me){
    let pos = me.pos;
    let angle = me.angle;
    let fov = me.fov
    let size = 1;
    let a =  new Vector2(1, 0).rotate(angle-fov/2)
    let b =  new Vector2(1, 0).rotate(angle+fov/2)

    let g = game_ctx.getImageData(0, 0, game_canvas.width, game_canvas.height);
    let buffer = g.data;

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
    game_ctx.putImageData(g, 0, 0);
}

function Render_Sprite(me){
    let pos = me.pos;
    let angle = me.angle;
    let fov = me.fov
    let size = 1;
    
    let dir =  new Vector2(1, 0).rotate(angle);
    let plane = new Vector2(0, Math.tan(fov/2)).rotate(angle);

    for(let i = 0; i<sprites.length; i++)
    {
        let type = sprites[i].sprite.type;
        let spriteX = sprites[i].sprite.pos.x-pos.x, spriteY = sprites[i].sprite.pos.y-pos.y;
        let invDet = 1.0 / (plane.x * dir.y - dir.x * plane.y);
        
        let transformX = invDet * (dir.y * spriteX - dir.x * spriteY);
        let transformY = invDet * (-plane.y * spriteX + plane.x * spriteY); 
        
        let spriteScreenX = parseInt((game_canvas.width / 2) * (1 + transformX / transformY));
        let spriteHeight = Math.abs(parseInt((h) / (transformY)))*1.05;
        
        if(transformY < 0) continue;
        let drawStartY = -spriteHeight / 2 + h / 2;
        if(drawStartY < 0) drawStartY = 0;
        let drawEndY = spriteHeight / 2 + h / 2;
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
            game_ctx.drawImage(img_sprite[type-1], img_sprite[type-1].width * ratioA, 0, 1, img_sprite[type-1].height,
                x, drawStartY, 1, drawEndY-drawStartY);
            // for(let y = drawStartY; y<=drawEndY; y++){
            //     let ratioA = (x - drawStartX) / (drawEndX - drawStartX);
            //     let ratioB = (y - drawStartY) / (drawEndY - drawStartY);
            //     game_ctx.drawImage(img_sprite[0], img_sprite[0].width * ratioA, img_sprite[0].height * ratioB, 1, 1,
            //         x, y, 1, 1);
            // }
        }
        // console.log(drawStartX, drawStartY);
        // game_ctx.fillStyle = "pink";
        // game_ctx.fillRect(drawStartX, drawStartY, spriteWidth, spriteHeight);
        // console.log(i, spriteHeight, drawStartX, drawStartY, transformX, transformY);
    }
}