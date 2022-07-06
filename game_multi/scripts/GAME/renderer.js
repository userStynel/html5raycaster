const R = 0;
const G = 1;
const B = 2;
const A = 3;
class Renderer{
    constructor(){
    }
    Render_Floor(me){
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
                
                buffer[idx + 0] = floor_tile_imgData[0].data[texidx][R];
                buffer[idx + 1] = floor_tile_imgData[0].data[texidx][G];
                buffer[idx + 2] = floor_tile_imgData[0].data[texidx][B];
                buffer[idx + 3] = floor_tile_imgData[0].data[texidx][A];
            }
        }
    }
    Render_Wall(me){
        for(let i = 0; i< me.rays.length; i++){
            let lay = me.rays[i];
            let height = Math.abs(h / lay.perpWallDist);
            var drawStart = ((h - height) / 2) | 0;
            var drawEnd = ((h + height) / 2) | 0;
            if(drawStart < 0) 
              drawStart = 0;
            if(drawEnd >= h)
                drawEnd = h-1;
           for(let y = drawStart; y<drawEnd; y++){
                let d = (y * 256 - h * 128 + height * 128) | 0;
                let texY = ( d * 64 / (height * 256))/* | 0*/;
                if (texY < 0) texY = 0;
                let idx = 4 * (game_canvas.width * y + i);
                let texidx = (((lay.hitWallTexcoordX * wall_tile_imgData[lay.hitWallTextureType-1].width) | 0) + 64 * (texY | 0));
                buffer[idx + 0] = wall_tile_imgData[lay.hitWallTextureType-1].data[texidx][R];
                buffer[idx + 1] = wall_tile_imgData[lay.hitWallTextureType-1].data[texidx][G];
                buffer[idx + 2] = wall_tile_imgData[lay.hitWallTextureType-1].data[texidx][B];
                buffer[idx + 3] = wall_tile_imgData[lay.hitWallTextureType-1].data[texidx][A];
           }
        }
    }
    Render_Sprite(me){
        let pos = me.pos;
        let angle = me.angle;
        let fov = me.fov
        
        let dir =  new Vector2(1, 0).rotate(angle);
        let plane = new Vector2(0, Math.tan(fov/2)).rotate(angle);
        let ch_sp = [];
        for(let idx = 0; idx<others.length; idx++){
            let obj = others[idx];
            ch_sp.push(new Sprite(CHARACTER, 0, new Vector2(obj.pos.x, obj.pos.y)));
        }
        let ou = sprites.concat(ch_sp);
        
        // 플레이어와 거리가 먼 순서대로 정렬
        ou = ou.sort((a, b) => {
            let distanceA = ((pos.x - a.pos.x)*(pos.x - a.pos.x) + (pos.y - a.pos.y)*(pos.y - a.pos.y));
            let distanceB = ((pos.x - b.pos.x)*(pos.x - b.pos.x) + (pos.y - b.pos.y)*(pos.y - b.pos.y));
            return (distanceA < distanceB);
        });
        
        for(let i = 0; i<ou.length; i++)
        {
            let textureTypeIDX = ou[i].textureIDX;
            let spriteX = ou[i].pos.x-pos.x; 
            let spriteY = ou[i].pos.y-pos.y;
            let imgData;
            if(ou.type == NATURAL)
            {
                imgData = sprite_tile_imgData;
            }
            else{
                imgData = character_tile_imgData;
            }
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
                    let tx = (imgData[textureTypeIDX].width * ratioA | 0) & (63);
                    let ty = (imgData[textureTypeIDX].height * ratioB | 0) & (63);
                    let texidx = ty * 64 + tx
                    if(imgData[textureTypeIDX].data[texidx][3] == 0) continue;
                    buffer[idx + 0] = imgData[textureTypeIDX].data[texidx][R];
                    buffer[idx + 1] = imgData[textureTypeIDX].data[texidx][G];
                    buffer[idx + 2] = imgData[textureTypeIDX].data[texidx][B];
                    buffer[idx + 3] = imgData[textureTypeIDX].data[texidx][A];
                }
            }
        }
    }
    Render_UI(){
        let img = ui_tile_img[0];
        game_ctx.drawImage(img, (game_canvas.width - img.width)/2, game_canvas.height - img.height);
    }
    Render_Game(player){
        game_ctx.fillStyle = "pink";
        game_ctx.fillRect(0, 0, game_canvas.width, game_canvas.height);
        g = game_ctx.getImageData(0, 0, game_canvas.width, game_canvas.height);
        buffer = g.data;
        this.Render_Floor(player);
        this.Render_Wall(player);
        this.Render_Sprite(player);
        game_ctx.putImageData(g, 0, 0);
        this.Render_UI();
    }
}

function Render_Floor(me){
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
            
            buffer[idx + 0] = floor_tile_imgData[0].data[texidx][R];
            buffer[idx + 1] = floor_tile_imgData[0].data[texidx][G];
            buffer[idx + 2] = floor_tile_imgData[0].data[texidx][B];
            buffer[idx + 3] = floor_tile_imgData[0].data[texidx][A];
        }
    }
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
            let texY = ( d * 64 / (height * 256))/* | 0*/;
            if (texY < 0) texY = 0;
            let idx = 4 * (game_canvas.width * y + i);
            let texidx = (((lay.hitWallTexcoordX * wall_tile_imgData[lay.hitWallTextureType-1].width) | 0) + 64 * (texY | 0));
            buffer[idx + 0] = wall_tile_imgData[lay.hitWallTextureType-1].data[texidx][R];
            buffer[idx + 1] = wall_tile_imgData[lay.hitWallTextureType-1].data[texidx][G];
            buffer[idx + 2] = wall_tile_imgData[lay.hitWallTextureType-1].data[texidx][B];
            buffer[idx + 3] = wall_tile_imgData[lay.hitWallTextureType-1].data[texidx][A];
       }
    }
}

function Render_Sprite(me){
    let pos = me.pos;
    let angle = me.angle;
    let fov = me.fov
    
    let dir =  new Vector2(1, 0).rotate(angle);
    let plane = new Vector2(0, Math.tan(fov/2)).rotate(angle);
    let ch_sp = [];
    for(let idx = 0; idx<others.length; idx++){
        let obj = others[idx];
        ch_sp.push(new Sprite(CHARACTER, 0, new Vector2(obj.pos.x, obj.pos.y)));
    }
    let ou = sprites.concat(ch_sp);
    
    // 플레이어와 거리가 먼 순서대로 정렬
    ou = ou.sort((a, b) => {
        let distanceA = ((pos.x - a.pos.x)*(pos.x - a.pos.x) + (pos.y - a.pos.y)*(pos.y - a.pos.y));
        let distanceB = ((pos.x - b.pos.x)*(pos.x - b.pos.x) + (pos.y - b.pos.y)*(pos.y - b.pos.y));
        return (distanceA < distanceB);
    });
    
    for(let i = 0; i<ou.length; i++)
    {
        let textureTypeIDX = ou[i].textureIDX;
        let spriteX = ou[i].pos.x-pos.x; 
        let spriteY = ou[i].pos.y-pos.y;
        let imgData;
        if(ou.type == NATURAL)
        {
            imgData = sprite_tile_imgData;
        }
        else{
            imgData = character_tile_imgData;
        }
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
                let tx = (imgData[textureTypeIDX].width * ratioA | 0) & (63);
                let ty = (imgData[textureTypeIDX].height * ratioB | 0) & (63);
                let texidx = ty * 64 + tx
                if(imgData[textureTypeIDX].data[texidx][3] == 0) continue;
                buffer[idx + 0] = imgData[textureTypeIDX].data[texidx][R];
                buffer[idx + 1] = imgData[textureTypeIDX].data[texidx][G];
                buffer[idx + 2] = imgData[textureTypeIDX].data[texidx][B];
                buffer[idx + 3] = imgData[textureTypeIDX].data[texidx][A];
            }
        }
    }
}

function Render_UI(){
    let img = ui_tile_img[0];
    game_ctx.drawImage(img, (game_canvas.width - img.width)/2, game_canvas.height - img.height);
}

function Render_Game(){
    game_ctx.fillStyle = "pink";
    game_ctx.fillRect(0, 0, game_canvas.width, game_canvas.height);
    g = game_ctx.getImageData(0, 0, game_canvas.width, game_canvas.height);
    buffer = g.data;
    Render_Floor(player);
    Render_Wall(player);
    Render_Sprite(player);
    game_ctx.putImageData(g, 0, 0);
    Render_UI();
}
