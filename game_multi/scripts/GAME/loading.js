function loadWall(src){
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

function loadFloor(src){
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

function loadSprite(src){
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

function loadUI(src){
    return new Promise((resolve, reject)=>{
        let img = new Image();
        img.src = src;
        img.onload = () => {
            ui_tile_img.push(img);
            resolve();
        }
    });
}

function loadCharacter(src){
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

function loadImage(wall_tiles, floor_tiles, sprite_tiles){
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

function isImageFileLoaded(){
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