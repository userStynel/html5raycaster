class INGAME_IMAGES{
    constructor(){
        this.wall_tiles;
        this.floor_tiles;
        this.sprite_tiles;
        this.character;
        this.ui_gun_img;
    }
}

class GAME{
    constructor(){
        this.map;
        this.sprites;
        this.images;
        this.renderer = new Renderer();
        this.player = new Player();
        this.others = [];
    }
    unpackGameStatus(game_status){
        this.others = [];
        let idx = 0;
        while(game_status[idx] != undefined)
        {
            let status = game_status[idx];
            if(status.id == socket.id){
                this.player.unpack(status.data);
            }
            else{
                this.others.push({id:status.id, pos:new Vector2(status.data.pos.x, status.data.pos.y)});
            }
            idx += 1;
        }
    }
    update(){
        if(IsImageFileLoaded()){
            this.player.update();
            this.renderer.Render_Game(this.player);
            hpbar.setAttribute('style', `--width:${this.player.health}`);
        }
    }
}