function fixAngular(rad){ // 각도를 0 ~ 360도 (0 ~ Pi/2 라디안)로 고정시킴
    if(0 <= rad && rad < Math.PI * 2)
        return rad;
    if(rad >= Math.PI * 2)
        return rad - Math.PI * 2;
    if(rad < 0)
        return rad + Math.PI * 2;
}
class Vector2{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
    add(b){ // 두 벡터를 더한 벡터를 반환합니다
        return new Vector2(this.x + b.x, this.y + b.y);
    }
    sub(b){ // 두 벡터를 뺀 벡터를 반환합니다
        return new Vector2(this.x - b.x, this.y - b.y);
    }
    mul(s){
        return new Vector2(s*this.x, s*this.y);
    }
    mag(){ // 벡터의 크기를 반환합니다
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    rotate(rad){ // rad 만큼 회전한 벡터를 반환합니다
        return new Vector2(this.x * Math.cos(rad) - this.y * Math.sin(rad), this.x * Math.sin(rad) + this.y * Math.cos(rad));
    }
    dir(){ // 방향벡터를 반환합니다
        return new Vector2(this.x / this.mag(), this.y / this.mag());
    }
}

class Ray{
    constructor(start, rayDir){
        this.start = start;
        this.rayDir = rayDir;
        this.perpWallDist, this.wallX;
        this.sprite = -1;
        this.type;
    }
    cast(){
        let mapX = this.start.x | 0;
        let mapY = this.start.y | 0;

        let deltaDistX = Math.sqrt(1 + (this.rayDir.y * this.rayDir.y)/(this.rayDir.x * this.rayDir.x));
        let deltaDistY = Math.sqrt(1 + (this.rayDir.x * this.rayDir.x)/(this.rayDir.y * this.rayDir.y));
        
        let stepX, stepY;
        let sideDistX, sideDistY;
        if(this.rayDir.x < 0){
            stepX = -1;
            sideDistX = (this.start.x - mapX) * deltaDistX;
        }else{
            stepX = 1;
            sideDistX = (mapX + 1 - this.start.x) * deltaDistX;
        }

        if(this.rayDir.y < 0){
            stepY = -1;
            sideDistY = (this.start.y - mapY) * deltaDistY;
        }else{
            stepY = 1;
            sideDistY = (mapY + 1 - this.start.y) * deltaDistY;
        }

        let side, hit = 0;
        while(hit == 0){
            side = sideDistX > sideDistY;
            if(side == 0){
                sideDistX += deltaDistX;
                mapX += stepX;
            }else{
                sideDistY += deltaDistY;
                mapY += stepY;
            }
            if(map[mapY][mapX] > 0){
                this.type = map[mapY][mapX];
                hit = 1;
            }
        }

        let perpWallDist;
        if (side == 0)
            perpWallDist = Math.abs((mapX - this.start.x + (1 - stepX) / 2) / this.rayDir.x);
        else
            perpWallDist = Math.abs((mapY - this.start.y + (1 - stepY) / 2) / this.rayDir.y);
        
        let wallX; // the exact value where the wall was hit
        if (side == 1) 
            wallX = this.start.x + ((mapY - this.start.y + (1 - stepY) / 2) / this.rayDir.y) * this.rayDir.x;
        else
            wallX = this.start.y + ((mapX - this.start.x + (1 - stepX) / 2) / this.rayDir.x) * this.rayDir.y;
        wallX -= wallX | 0;
        
        this.perpWallDist = perpWallDist; this.wallX = wallX;
    }
}
class Player{
    constructor(pos){
        this.pos = pos;
        this.health = 100;
        this.angle = Math.PI/180 * 0;
        this.bullet = 25;
        this.fov = Math.PI/180 * 75;
        this.velocity = 1;
        this.angular_velocity = (Math.PI/180) * 1;
        this.Rays = [];
    }
    cast(){
        //console.log("start!!");
        let dir = new Vector2(1, 0).rotate(this.angle);
        let plane = new Vector2(0, Math.tan(this.fov/2)).rotate(this.angle);
        
        this.Rays = [];

        for(let i = 0; i<game_canvas.width; i++){
            let r = 2 * i / game_canvas.width - 1;
            let rayDir = dir.add(plane.mul(r));
            this.Rays.push(new Ray(this.pos, rayDir));
        }
        for(let i = 0; i<game_canvas.width; i++){
            //console.log(lay);
            let lay = this.Rays[i];
            lay.cast();
            zBuffer[i] = lay.perpWallDist;
        }
        //console.log("end!!");
    }
    draw(){
        map_ctx.beginPath();
        map_ctx.fillStyle = PLAYER_COLOR;
        map_ctx.arc(this.pos.x*8, this.pos.y*8, PLAYER_RADIUS, 0, Math.PI * 2);
        map_ctx.closePath();
        map_ctx.fill();

        // let line = this.pos.add(new Vector2(1, 0).rotate(this.angle).mul(15));
        // map_ctx.beginPath();
        // map_ctx.strokeStyle = "green";
        // map_ctx.lineTo(this.pos.x*8, this.pos.y*8);
        // map_ctx.lineTo(line.x+this.pos.x*8, line.y+this.pos.y*8);
        // map_ctx.closePath();
        // map_ctx.stroke();

        // for(let lay of this.Rays){
        //     map_ctx.fillStyle = "crimson";
        //     map_ctx.beginPath();
        //     map_ctx.arc(lay.intersect.point.x, lay.intersect.point.y, PLAYER_RADIUS, 0, Math.PI * 2);
        //     map_ctx.closePath();
        //     map_ctx.fill();
        // }
    }
    processInput(){
        if(keyBuffer === null) return;
        let deltaPos = new Vector2(0, 0);
        if(keyBuffer == 'w')
            deltaPos = new Vector2(1, 0).rotate(this.angle).mul(this.velocity);
        else if(keyBuffer == 's')
            deltaPos = new Vector2(1, 0).rotate(this.angle).mul(-this.velocity);
        else if(keyBuffer == 'a')
            deltaPos = new Vector2(1, 0).rotate(this.angle + Math.PI/2).mul(-this.velocity);
        else if(keyBuffer == 'd')
            deltaPos = new Vector2(1, 0).rotate(this.angle + Math.PI/2).mul(+this.velocity);
        else if(keyBuffer == 'q')
            this.angle = fixAngular(this.angle - this.angular_velocity);
        else if(keyBuffer == 'e')
            this.angle = fixAngular(this.angle + this.angular_velocity);
        keyBuffer = null;
        this.pos = this.pos.add(deltaPos);
        // console.log(this.angle * 180 / Math.PI);
    }
    update(){
        this.processInput();
        this.cast();
    }
}