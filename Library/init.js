const Vector2 = require('./userInfo').Vector2;
const userInfo = require('./userInfo').userInfo;

const WIDTH = 32
const HEIGHT = 17

const SIZE = 8

const FRAME_RATE = 32;

function Initial_GameSetting(room, map_data){
    for(let id in room.users){
        let user = room.users[id];
        if(user.team == 1)
            user.pos = new Vector2(5, 5);
        else if(user.team == 2)
            user.pos = new Vector2(15, 15);
    }
    room.map = map_data.map;
    let initial_game_status = room.GameStatus();
    return initial_game_status;
}

exports.Initial_GameSetting = Initial_GameSetting;

