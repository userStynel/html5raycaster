class Sprite{
    constructor(type, pos){
        this.type = type;
        this.pos = pos;
        this.checked = false;
    }
}

function clearSprites(spriteList){
    for(let sprite of spriteList){
        sprite.checked = false;
    }
}