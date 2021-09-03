const Vector2 = require('./userInfo').Vector2;
const userInfo = require('./userInfo').userInfo;

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

function Init_GameSetting(hash){
    Init();
    
    let room =  roomManager.roomlist[hash];
    let data = {};

    data['map'] = map;
    data['sprite_map'] = sprite_map;
    data['sprites'] = sprites[0].serialize();

    for(let id in room.users){
        let temp_name = room.users[id].name;
        let temp_socket = room.users[id].socket;
        let temp_team = room.users[id].team;
        room.users[id] = new userInfo(temp_name, null, temp_socket);
        let user = room.users[id];
        user.team = temp_team;
        if(user.team == 1)
            user.pos = new Vector2(5, 5);
        else if(user.team == 2)
            user.pos = new Vector2(15, 15);
    }
    return data;
}
exports.map = map;
exports.sprite_map = sprite_map;
exports.sprites = sprites;
exports.Init_GameSetting = Init_GameSetting;

