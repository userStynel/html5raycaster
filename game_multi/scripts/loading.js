function Loading_Wall(idx){
    if(idx == wall_length){
        console.log("Loading Wall Images finished...")
        wall_loaded = true;
    }
    else{
        let i = idx;
        let img = new Image();
        img.src = `./texture/wall/wall_${idx+1}.png`;
        img.onload = () => {
            img_wall.push(img);
            let temp = document.createElement('canvas');
            let tempctx = temp.getContext('2d');
            temp.width = img.width; temp.height = img.height;
            tempctx.drawImage(img, 0, 0);
            let imgd = tempctx.getImageData(0, 0, img.width, img.height).data;
            var rgbArray = new Array(img.width * img.height);
            for(let p = 0; p<img.width*img.height; p++){
                rgbArray[p] = [imgd[4*p], imgd[4*p+1], imgd[4*p+2], imgd[4*p+3]];
            }
            console.log(imgd);
            console.log(rgbArray);
            data_wall.push(rgbArray);
            temp.remove();
            Loading_Wall(i+1);
        }
    }
}

function Loading_Floor(idx){
    if(idx == floor_length){
        console.log("Loading Floor Images finished...")
        floor_loaded = true;
    }
    else{
        let i = idx;
        let img = new Image();
        img.src = `./texture/floor/floor_${idx+1}.png`;
        img.onload = () => {
            img_floor.push(img);
            let temp = document.createElement('canvas');
            let tempctx = temp.getContext('2d');
            temp.width = img.width; temp.height = img.height;
            tempctx.drawImage(img, 0, 0);
            let imgd = tempctx.getImageData(0, 0, img.width, img.height).data;
            var rgbArray = new Array(img.width * img.height);
            for(let p = 0; p<img.width*img.height; p++){
                rgbArray[p] = [imgd[4*p], imgd[4*p+1], imgd[4*p+2], imgd[4*p+3]];
            }
            data_floor.push(rgbArray);
            temp.remove();
            Loading_Floor(i+1);
        }
    }
}

function Loading_Sprite(idx){
    if(idx == sprite_length){
        console.log("Loading Sprite Images finished...")
        sprite_loaded = true;
    }
    else{
        let i = idx;
        let img = new Image();
        img.src = `./texture/sprite/sprite_${idx+1}.png`;
        img.onload = () => {
            img_sprite.push(img);
            let temp = document.createElement('canvas');
            let tempctx = temp.getContext('2d');
            temp.width = img.width; temp.height = img.height;
            tempctx.drawImage(img, 0, 0);
            let imgd = tempctx.getImageData(0, 0, img.width, img.height).data;
            var rgbArray = new Array(img.width * img.height);
            for(let p = 0; p<img.width*img.height; p++){
                rgbArray[p] = [imgd[4*p], imgd[4*p+1], imgd[4*p+2], imgd[4*p+3]];
            }
            data_sprite.push(rgbArray);
            temp.remove();
            Loading_Sprite(i+1);
        }
    }
}

function Loading_Image(){
    let img = new Image();
    let img2 = new Image();
    img.src = './texture/gun.png';
    img.onload = () => {
        gun_loaded = true;
        wp_img = img;
        img_gun = img;
    }
    img2.src = './texture/knife.png';
    img2.onload = () => {
        knife_loaded = true;
        img_knife = img2;
    }
    Loading_Wall(0);
    Loading_Sprite(0);
    Loading_Floor(0);
}

function IsImageFileLoaded(){
    //console.log(wall_loaded, sprite_loaded, gun_loaded);
    return (wall_loaded && sprite_loaded && gun_loaded && floor_loaded && knife_loaded);
}


function Loading_ANIMATION(){
    ANIMATION_LIST['gun_anim'] = new spriteAnimation('gun_anim', {width: 256, height: 159}, 0.25);
}