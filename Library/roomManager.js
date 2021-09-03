const Room  = require('./room').Room;

class RoomManager{
    constructor(){
        this.roomlist = {};
    }
    makingHash(){
        let ret = new String();
        for(let i = 0; i<5; i++)
            ret = ret.concat(String.fromCharCode(Math.floor(Math.random()*26)+97));
        console.log(ret);
        return ret;
    }
    makingRoom(title, password, maxPlayer, name){
        let hash = this.makingHash();
        this.roomlist[hash] = new Room(hash, title, password, maxPlayer);
        this.roomlist[hash].queue[name] = true;
        return hash
    }
    deleteRoom(hash){
        for(let id in this.roomlist[hash].users){
            let user = this.roomlist[hash].users[id];
            let socket = user.socket;
            socket.emit('room_deleted');
        }
        delete this.roomlist[hash];
    }
    CheckAndClean(){
        for(let hash in this.roomlist){
            if(this.roomlist[hash].clearflag)
                this.deleteRoom(hash);
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
            console.log(r);
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