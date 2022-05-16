const Room  = require('./room').Room;

class RoomManager{
    constructor(){
        this.roomlist = {};
    }
    makingHash(){
        let ret = new String();
        for(let i = 0; i<5; i++)
            ret = ret.concat(String.fromCharCode(Math.floor(Math.random()*26)+97));
        return ret;
    }
    makingRoom(title, password, maxPlayer){
        let hash = this.makingHash();
        this.roomlist[hash] = new Room(hash, title, password, maxPlayer);
        console.log(`Room ${hash} created!`);
        return hash
    }
    deleteRoom(hash){
        io.to(this.hash).emit('room_deleted');
        delete this.roomlist[hash];
    }
    CheckAndClean(){ // 방장이 나가서 닫힌 방을 정리해줌
        for(let hash in this.roomlist){
            if(this.roomlist[hash].clearflag)
            {
                this.deleteRoom(hash);
                console.log(`Room ${hash} has deleted!`);
            }
        }
    }
    Process(){
        for(let hash in this.roomlist){
            let room = this.roomlist[hash];
            if(room.playMode)
                room.preupdate();
        }
    }
    serializeRoomList(){
        let ret = [];
        for(let hash in this.roomlist){
            let r = this.roomlist[hash];
            let room = {};
            room['hash'] = r.hash;
            room['title'] = r.title;
            room['maxPlayer'] = r.maxPlayer;
            room['nowPlayer'] = r.userCount;
            if(r.password != '')
                room['isPassword'] = true;
            else
                room['isPassword'] = false;
            ret.push(room);
        }
        return ret;
    }
}

exports.RoomManager = RoomManager;