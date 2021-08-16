const Vector2 = require('./userInfo').Vector2;

const WIDTH = 32
const HEIGHT = 17

const SIZE = 8

const FRAME_RATE = 32;

// var 
var sprites = [];
var map = [];
var sprite_map = [];
var sprites = [];

class Sprite{
    constructor(type, pos){
        this.type = type;
        this.pos = pos;
    }
    serialize(){
        return {type: this.type, pos: {x: this.pos.x, y: this.pos.y}};
    }
}

function InitMap(){
    for(let y = 0; y<HEIGHT; y++){
        map[y] = [];
        sprite_map[y] = [];
        for(let x = 0; x<WIDTH; x++){
            if(y == 0 || y == (HEIGHT - 1) || x == 0 || x == (WIDTH - 1)){
                if(x == WIDTH/2) map[y][x] = 2;
                else map[y][x] = 2;
            }
            else map[y][x] = 0;
        }
    }
    map[11][11] = 2;
    map[10][11] = 2;
    map[9][11] = 2;
    map[8][11] = 2;
    map[7][11] = 2;
    for(let sprite of sprites){
        sprite_map[sprite.pos.y][sprite.pos.x] = sprite.type;
    }
}

function Init(){
    sprites.push(new Sprite(1, new Vector2(5, 5)));
    InitMap();
}

Init();
exports.map = map;
exports.sprite_map = sprite_map;
exports.sprites = sprites;