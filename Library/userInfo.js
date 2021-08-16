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

class userInfo{
    constructor(name, pos, socket){
        this.angle = 0;
        this.pos = pos;
        this.name = name;
        this.fov = Math.PI/180 * 75;
        this.velocity = 0.7;
        this.angular_velocity = (Math.PI/180) * 1;
        this.socket = socket;
        this.keyBuffer = null;
    }
    processInput(){
        if(this.keyBuffer === null) return;
        let key = this.keyBuffer;
        let deltaPos = new Vector2(0, 0);
        if(key == 'w')
            deltaPos = new Vector2(1, 0).rotate(this.angle).mul(this.velocity);
        else if(key == 's')
            deltaPos = new Vector2(1, 0).rotate(this.angle).mul(-this.velocity);
        else if(key == 'a')
            deltaPos = new Vector2(1, 0).rotate(this.angle + Math.PI/2).mul(-this.velocity);
        else if(key == 'd')
            deltaPos = new Vector2(1, 0).rotate(this.angle + Math.PI/2).mul(+this.velocity);
        else if(key == 'q')
            this.angle = fixAngular(this.angle - this.angular_velocity);
        else if(key == 'e')
            this.angle = fixAngular(this.angle + this.angular_velocity);
        this.keyBuffer = null;
        this.pos = this.pos.add(deltaPos);
    }
}

exports.Vector2 = Vector2;
exports.userInfo = userInfo;