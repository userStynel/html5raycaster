const userInfo  = require('./userInfo').userInfo;
const Vector2 = require('./userInfo').Vector2;

class Room{
    constructor(hash, title, password, maxPlayer){
        this.hash = hash;
        this.users = {};
        this.map = map;
        this.title = title;
        this.userCount = 0;
        this.maxPlayer = maxPlayer;
        this.password = password;
        this.captain;
        this.clearflag = false;
        this.playMode = false;
        this.queue = {}
    }
    tryingJoin(id, password){
        if(password === null || password == this.password){
            if(this.userCount + 1 <= this.maxPlayer){
                return true;
            }
            else
                return false;
        }
        else{
            return false;
        }
    }
    Join(id){
        let name = mappingSocketToName[id];
        let socket = mappingNameToSocket[name];
        this.userCount += 1;
        if(this.userCount == 1)
            this.captain = id;
        this.users[id] = new userInfo(name, null, socket);
    }
    Leave(id){
        this.userCount -= 1;
        delete this.users[id];
        if(id == this.captain)
            this.clearflag = true;
    }

    sendingUserData(){
        let ret = {};
        for(let id in this.users){
            let user = this.users[id];
            if(user.pos == null) continue;
            let data = user.packing(); 
            ret[id] = data;
        }
        return ret;
    }
    
    preupdate(){
        for(let id in this.users){
            let user = this.users[id];
            let socket = user.socket;
            socket.emit('pre_update');
        }
        this.update();
    }

    update(){
        let cntLeft = 0; let cntRight = 0;
        for(let id in this.users){
            let socket = this.users[id].socket;
            let goflag = false;
            let user = this.users[id];
            if(user.pos == null) continue;
            user.processInput();
            user.processMouse();
            if(user.health < 0){
                goflag = true;
                user.team = 0;
                user.pos = null;
                //socket.disconnect();
                //DeleteUser(idd);
            }
        }
        if(this.goflag) io.to(this.hash).emit('gameover', this.serializeUL());
        let ret = this.sendingUserData();
        for(let id in this.users){
            let socket = this.users[id].socket;
            if(this.users[id].team == 1) cntLeft += 1;
            else if(this.users[id].team == 2) cntRight += 1;
            socket.emit('update', ret);
        }
        if(cntLeft == 0 || cntRight == 0){
            let isRightWin = (cntRight != 0) ? true : false;
            this.playMode = false;
             io.to(this.hash).emit('game_result', isRightWin);
             io.to(this.hash).emit('game_finish', '');
        }
    }

    serializeUL(){
        let ret = [];
        for(let id in this.users){
            let user = this.users[id];
            ret.push({name:user.name, team:user.team});
        }
        return ret;
    }
    checkConnection(name, password){
        let ret = {};
        if(this.userCount >= this.maxPlayer){
            ret['result'] = false; ret['errcode'] = 1;
        }
        else if(password == this.password){
            this.queue[name] = true;
            ret['result'] = true; ret['errcode'] = 0;
        }
        else{
            ret['result'] = false; ret['errcode'] = 2;
        }
        console.log(ret);
        return ret;
    }
    avoid(param){
        for(let id in this.queue){
            if(param == id){
                delete this.queue[id];
                return false;
            }
        }
        return true;
    }
}

exports.Room = Room;