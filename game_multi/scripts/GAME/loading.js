function Loading_Wall(src){
    return new Promise((resolve, reject)=>{
        let img = new Image();
        img.src = src;
        img.onload = () => {
            wall_tile_img.push(img);
            let temp = document.createElement('canvas');
            let tempctx = temp.getContext('2d');
            temp.width = img.width; temp.height = img.height;
            tempctx.drawImage(img, 0, 0);
            let imgdata = tempctx.getImageData(0, 0, img.width, img.height).data;
            var rgbArray = new Array(img.width * img.height);
            for(let p = 0; p<img.width*img.height; p++){
                rgbArray[p] = [imgdata[4*p], imgdata[4*p+1], imgdata[4*p+2], imgdata[4*p+3]];
            }
            wall_tile_imgData.push(rgbArray);
            temp.remove();
            resolve();
        }
    });
}

function Loading_Floor(src){
    return new Promise((resolve, reject)=>{
        let img = new Image();
        img.src = src;
        img.onload = () => {
            floor_tile_img.push(img);
            let temp = document.createElement('canvas');
            let tempctx = temp.getContext('2d');
            temp.width = img.width; temp.height = img.height;
            tempctx.drawImage(img, 0, 0);
            let imgd = tempctx.getImageData(0, 0, img.width, img.height).data;
            var rgbArray = new Array(img.width * img.height);
            for(let p = 0; p<img.width*img.height; p++){
                rgbArray[p] = [imgd[4*p], imgd[4*p+1], imgd[4*p+2], imgd[4*p+3]];
            }
            floor_tile_imgData.push(rgbArray);
            temp.remove();
            resolve();
        }
    });
}

function Loading_Sprite(src){
    return new Promise((resolve, reject)=>{
        let img = new Image();
        img.src = src;
        img.onload = () => {
            sprite_tile_img.push(img);
            let temp = document.createElement('canvas');
            let tempctx = temp.getContext('2d');
            temp.width = img.width; temp.height = img.height;
            tempctx.drawImage(img, 0, 0);
            let imgd = tempctx.getImageData(0, 0, img.width, img.height).data;
            var rgbArray = new Array(img.width * img.height);
            for(let p = 0; p<img.width*img.height; p++){
                rgbArray[p] = [imgd[4*p], imgd[4*p+1], imgd[4*p+2], imgd[4*p+3]];
            }
            sprite_tile_imgData.push(rgbArray);
            temp.remove();
            resolve();
        }
    });
}

function Loading_UI(src){
    return new Promise((resolve, reject)=>{
        let img = new Image();
        img.src = src;
        img.onload = () => {
            ui_tile_img.push(img);
            resolve();
        }
    });
}

function LOADING_Character(src){
    return new Promise((resolve, reject)=>{
        let img = new Image();
        img.src = src;
        img.onload = () => {
            character_tile_img.push(img);
            let temp = document.createElement('canvas');
            let tempctx = temp.getContext('2d');
            temp.width = img.width; temp.height = img.height;
            tempctx.drawImage(img, 0, 0);
            let imgd = tempctx.getImageData(0, 0, img.width, img.height).data;
            var rgbArray = new Array(img.width * img.height);
            for(let p = 0; p<img.width*img.height; p++){
                rgbArray[p] = [imgd[4*p], imgd[4*p+1], imgd[4*p+2], imgd[4*p+3]];
            }
            character_tile_imgData.push({width:img.width, height:img.height, data:rgbArray});
            temp.remove();
            resolve();
        }
    });
}

function Loading_Image(wall_tiles, floor_tiles, sprite_tiles){
    let ui_promises = [];
    let character_promies = [];

    for(let ui of ui_src)
        ui_promises.push(Loading_UI(ui));
    for(let character of character_src)
        character_promies.push(LOADING_Character(character));
    
    wall_tile_imgData = wall_tiles;
    floor_tile_imgData = floor_tiles;
    sprite_tile_imgData = sprite_tiles;

    wall_loaded = true;
    floor_loaded = true;
    sprite_loaded = true;

    Promise.all(ui_promises).then(()=>{ui_loaded = true});
    Promise.all(character_promies).then(()=>{character_loaded = true});
}

function IsImageFileLoaded(){
    return (wall_loaded && floor_loaded && ui_loaded && character_loaded && sprite_loaded);
}

function setLoadingFalseAll(){
    wall_loaded = false;
    floor_loaded = false;
    ui_loaded = false;
    character_loaded = false;
    sprite_loaded = false;
}

function setEmptyImageData(){
    ui_tile_img = [];
    wall_tile_img = [];
    wall_tile_imgData = [];
    floor_tile_img = [];
    floor_tile_imgData = [];
    sprite_tile_img = [];
    sprite_tile_imgData = [];
    character_tile_img = [];
    character_tile_imgData = [];
}

function setEmptyMapAndSpriteData(){
    map = [];
    sprite = [];
}

/*
function Loading_ANIMATION(){
    ANIMATION_LIST['gun_anim'] = new spriteAnimation('gun_anim', {width: 256, height: 159}, 0.25);
}
*/