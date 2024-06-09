class spriteAnimation{
    constructor(name, size, duration){
        this.filesrc = `/texture/animation/${name}.png`;
        this.fullIMG;
        this.cutIMGS = [];
        this.size = size;
        this.duration;
    }
    slice(idx){
        let that = this;
        return new Promise((resolve, reject)=>{
            let i = idx;
            let temp = document.createElement('canvas');
            let tempctx = temp.getContext('2d');
            temp.width = that.size.width; temp.height = that.size.height;
            tempctx.drawImage(that.fullIMG, i*that.size.width, 0, that.size.width, that.size.height, 0, 0, temp.width, temp.height);
            let img = new Image();
            img.src = temp.toDataURL();
            temp.remove();
            img.onload = () => {
                that.cutIMGS[i] = img;
                resolve();
            }
        });
    }
    load(){
        return new Promise((resolve, reject)=>{
            let img = new Image();
            let that = this;
            img.src = this.filesrc;
            img.onload = function(){
                that.fullIMG = img;
                let count = (that.fullIMG.width / that.size.width) | 0;
                let slicePromises = [];
                for(let i = 0; i<count; i++)
                    slicePromises.push(slice(i));
                Promise.all(slicePromises);
                resolve();
            };
        });
    }
}

class AnimationFactory{
    constructor(game, target, anim){
        this.game = game;
        this.target = target;
        this.anim = ANIMATION_LIST[anim];
        this.frame = 0;
        this.oneCutlength = (this.anim.duration/this.anim.cutIMGS.length)|0;
    }
    update(){
        this.frame += 1;
        this.game.target = this.anim.cutIMGS[((this.frame/this.oneCutlength)|0) % this.anim.cutIMGS.length];
        this.flowFrame %= this.anim.endFrame;
        if(this.flowFrame == 0)
        {
            return false;
        }
        return true;
    }
}

class AnimationController{
    constructor(game){
        this.game = game;
        ANIMATION_LIST = {};
        ANIMATION_QUEUE = {};
    }
    addAnimation(game, target, anim){
        //ANIMATION_LIST[animation_name] = new spriteAnimation()
    }
}