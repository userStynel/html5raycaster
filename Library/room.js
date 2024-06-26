const UserInfo  = require('./userInfo').UserInfo;

class Room{
    constructor(hash, title, password, maxPlayer){
        this.hash = hash;
        this.users = {};
        this.map;
        this.title = title; // 방제
        this.numOfUsers = 0;
        this.maxPlayer = maxPlayer;
        this.password = password;
        this.captain; // 방장
        this.roomClearFlag = false;
        this.isPlayMode = false;
        this.queue = {} // 대기 큐
    }
    static makingHash(){
        let ret = new String();
        for(let i = 0; i<5; i++)
            ret = ret.concat(String.fromCharCode(Math.floor(Math.random()*26)+97));
        return ret;
    }
    tryingJoin(password){
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
    join(socketID){
        let name = mapSocketToUserName[socketID];
        this.userCount += 1;
        if(this.userCount == 1)
            this.captain = id;
        this.users[socketID] = new UserInfo(name, null);
    }
    leave(socketID){
        this.userCount -= 1;
        delete this.users[socketID];
        if(socketID == this.captain)
            this.clearflag = true;
    }
    getGameStatus(){
        let ret = [];
        for(let id in this.users){
            let user = this.users[id];
            if(user.pos == null) continue;
            let data = user.packing(); 
            ret.push({id:id, data: data});
        }
        return ret;
    }
    preUpdate(){
        io.to(this.hash).emit('pre_update');
        this.update();
    }
    update(){
        let cntLeft = 0; let cntRight = 0;
        for(let id in this.users){
            let goflag = false;
            let user = this.users[id];
            if(user.pos == null) continue;
            user.processInput(this.map);
            user.processMouse();
            if(user.health < 0){
                goflag = true;
                user.team = 0;
                user.pos = null;
            }
        }
        if(this.goflag) io.to(this.hash).emit('gameover', this.serializeUL());
        let ret = this.GameStatus();
        for(let id in this.users){
            if(this.users[id].team == 1) cntLeft += 1;
            else if(this.users[id].team == 2) cntRight += 1;
        }
        if(cntLeft == 0 || cntRight == 0){
            let isRightWin = (cntRight != 0) ? true : false;
            this.playMode = false;
             io.to(this.hash).emit('game_result', isRightWin);
             io.to(this.hash).emit('game_finish', '');
        }
        else io.to(this.hash).emit('update', ret);
    }
    getUserList(){
        let ret = [];
        for(let id in this.users){
            let user = this.users[id];
            ret.push({name:user.name, team:user.team});
        }
        return ret;
    }
    checkConnection(password){
        let ret = {};
        if(this.userCount >= this.maxPlayer){
            ret['result'] = false; ret['errcode'] = 1;
        }
        else if(password == this.password){
            let key = Room.makingHash();
            this.queue[key] = true;
            ret['result'] = true;
            ret['key'] = key
        }
        else{
            ret['result'] = false; ret['errcode'] = 2;
        }
        return ret;
    }
    auth(authKey){
        if(this.queue[authKey]){
            delete this.queue[authKey];
            return true;
        }
        else return false;
    }
}

exports.Room = Room;