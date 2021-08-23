var ANIMATION_LIST = {}
var ANIMATION_QUEUE = {};

class spriteAnimation{
    constructor(name, size, sec){
        this.filesrc = `/texture/animation/${name}.png`;
        this.fullIMG;
        this.size = size;
        this.cutIMGS = [];
        this.cutIMGDATA = [];
        this.endFrame = (32 * sec)|0;
        this.count
        this.IMG();
    }
    SLICE(idx){
        let i = idx;
        if(i<this.count){
            let that = this;
            let temp = document.createElement('canvas');
            let tempctx = temp.getContext('2d');
            temp.width = this.size.width; temp.height = this.size.height;
            tempctx.drawImage(this.fullIMG, i*this.size.width, 0, this.size.width, this.size.height, 0, 0, temp.width, temp.height);
            let img = new Image();
            img.src = temp.toDataURL();
            temp.remove();
            img.onload = function(){
                that.cutIMGS[i] = img;
                that.SLICE(i+1);
            }
        }
    }
    IMG(){
        let img = new Image();
        let that = this;
        img.src = this.filesrc;
        img.onload = function(){
            that.fullIMG = img;
            that.count = (that.fullIMG.width / that.size.width) | 0;
            that.SLICE(0);
        };
    }
}

class AnimationFactory{
    constructor(target, anim){
        this.target = target;
        this.anim = ANIMATION_LIST[anim];
        this.flowFrame = 0;
        this.oneCutlength = (this.anim.endFrame/this.anim.count)|0;
    }
    update(){
        console.log(this.flowFrame, this.oneCutlength);
        this.flowFrame += 1;
        this.flowFrame %= this.anim.endFrame;
        if(this.target == 0)
        {
            wp_img = this.anim.cutIMGS[((this.flowFrame/this.oneCutlength)|0)%this.anim.count];
        }
        if(this.flowFrame == 0)
        {
            if(this.target == 0) gun_animated = false;
            return false;
        }
        return true;
    }
}