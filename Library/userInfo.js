const KEY = require('../game_multi/scripts/common').key;

function fixAngular(rad){ // 각도를 0 ~ 360도 (0 ~ Pi/2 라디안)로 고정시킴
    if(0 <= rad && rad < Math.PI * 2)
        return rad;
    if(rad >= Math.PI * 2)
        return rad - Math.PI * 2;
    if(rad < 0)
        return rad + Math.PI * 2;
}

function toRadian(deg){
    return deg * (Math.PI / 180.0);
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

class userInfo{
    constructor(name, pos){
        this.angle = 0;
        this.pos = pos;
        this.name = name;
        this.fov = toRadian(75);
        this.movement_velocity = 0.13;
        this.angular_velocity = toRadian(1.9);
        this.keyBuffer = 0;
        this.mouseBuffer = [];
        this.health = 100;
        this.team = 0;
    }
    processInput(map = null){
        if(this.keyBuffer == 0 || this.keyBuffer == null) return;
        let key = this.keyBuffer;
        let deltaPos = new Vector2(0, 0);
        if(key & KEY.UP)
            deltaPos = deltaPos.add(new Vector2(1, 0).rotate(this.angle).mul(this.movement_velocity));
        if(key & KEY.DOWN)
            deltaPos = deltaPos.add(new Vector2(1, 0).rotate(this.angle).mul(-this.movement_velocity));
        if(key & KEY.LEFT)
            deltaPos = deltaPos.add(new Vector2(1, 0).rotate(this.angle + Math.PI/2).mul(-this.movement_velocity));
        if(key & KEY.RIGHT)
            deltaPos = deltaPos.add(new Vector2(1, 0).rotate(this.angle + Math.PI/2).mul(+this.movement_velocity));
        if(key & KEY.TURN_LEFT)
            this.angle = fixAngular(this.angle - this.angular_velocity);
        if(key & KEY.TURN_RIGHT)
            this.angle = fixAngular(this.angle + this.angular_velocity);
        if(key & KEY.TURN_BACK)
            this.angle = fixAngular(this.angle + Math.PI);
        let temppos = this.pos.add(deltaPos);
        if(map[(temppos.y|0)][(temppos.x|0)] != 0) return;
        this.pos = temppos
    }
    processMouse(){
        if(this.mouseBuffer.length == 0) return;
        let start = this.mouseBuffer[0];
        let end = this.mouseBuffer[this.mouseBuffer.length-1];
        let delta = end-start;
        this.angle = fixAngular(this.angle + 0.75*delta*this.angular_velocity);
    }
    packing(){
        let ret = {
            pos: {x: this.pos.x, y: this.pos.y},
            angle: this.angle,
            health: this.health,
            fov: this.fov
        }
        return ret;
    }
}

exports.Vector2 = Vector2;
exports.userInfo = userInfo;