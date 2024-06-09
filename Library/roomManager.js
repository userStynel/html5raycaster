const Room  = require('./room').Room;

class RoomManager{
    constructor(){
        this.roomList = {};
    }
    static makingHash(){
        let ret = new String();
        for(let i = 0; i<5; i++)
            ret = ret.concat(String.fromCharCode(Math.floor(Math.random()*26)+97));
        return ret;
    }
    makingRoom(title, password, maxPlayer){
        let hash = RoomManager.makingHash();
        this.roomList[hash] = new Room(hash, title, password, maxPlayer);
        console.log(`Room ${hash} created!`);
        return hash;
    }
    deleteRoom(hash){
        io.to(this.hash).emit('room_deleted');
        delete this.roomlist[hash];
    }
    checkAndCleanEmptyRoom(){ // 방장이 나가서 닫힌 방을 정리해줌
        for(let hash in this.roomlist){
            if(this.roomlist[hash].clearflag)
            {
                this.deleteRoom(hash);
                console.log(`Room ${hash} has deleted!`);
            }
        }
    }
    process(){
        for(let hash in this.roomlist){
            let room = this.roomlist[hash];
            if(room.playMode)
                room.preupdate();
        }
    }
    getRoomInfoList(){
        let ret = [];
        for(let hash in this.roomList){
            let r = this.roomList[hash];
            let room = {};
            room['hash'] = r.hash;
            room['title'] = r.title;
            room['maxPlayer'] = r.maxPlayer;
            room['nowPlayer'] = r.numOfUsers;
            if(r.password != '')
                room['isPasswordSet'] = true;
            else
                room['isPasswordSet'] = false;
            ret.push(room);
        }
        return ret;
    }
}

exports.RoomManager = RoomManager;