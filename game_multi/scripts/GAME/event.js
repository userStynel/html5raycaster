function ADD_CLIENT_WINDOW_EVENT(){
    window.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    }); 
    
    window.addEventListener("keydown", (e)=>{
        if(document.getElementById('msg') === document.activeElement) return;
        if(isWaitMode) return;
        if(e.key == 'f' || e.key == 'w' || e.key == 'a' || e.key == 's' || e.key == 'd' || e.key == 'q' || e.key == 'e'){
            keyBuffer2.push(e.key);
            //socket.emit('input', e.key);
            if(e.key == 'f')
                keyBuffer |= KEY.TURN_BACK;
            if(e.key == 'w')
                keyBuffer |= KEY.UP;
            if(e.key == 'a')
                keyBuffer |= KEY.LEFT;
            if(e.key == 's')
                keyBuffer |= KEY.DOWN;
            if(e.key == 'd')
                keyBuffer |= KEY.RIGHT;
            if(e.key == 'q')
                keyBuffer |= KEY.TURN_LEFT;
            if(e.key == 'e')
                keyBuffer |= KEY.TURN_RIGHT;
        }
    });
    
    window.addEventListener('keyup', (e)=>{
        if(e.key == ' ' && !isWaitMode){
            if(ANIMATION_QUEUE[0] === undefined) ANIMATION_QUEUE[0] = new AnimationFactory(0, 'gun_anim');
            socket.emit('shoot', checkShot());
            // game_mode = !game_mode;
            // if(game_mode) document.getElementById('debugger').setAttribute('class', 'gamemode');
            // else document.getElementById('debugger').removeAttribute('class');
        }
        else if(e.key =='Tab'){
            e.preventDefault();
        }
        else if(e.key == 'Escape'){
            isWaitMode = !isWaitMode;
            checkMode();
        }
    });
    
    // game_canvas.addEventListener('mouseover', (e) => {
    //     game_canvas.setAttribute('class', 'noCursor');
    // });
    
    // game_canvas.addEventListener('mouseout', (e) => {
    //     game_canvas.removeAttribute('class');
    // });
    
    // game_canvas.addEventListener('mousemove', (e) => {
    //     mouseBuffer.push(e.offsetX);
    // });
    
    game_canvas.addEventListener('click', (e) => {
        if(!isWaitMode){
            if(ANIMATION_QUEUE[0] === undefined) ANIMATION_QUEUE[0] = new AnimationFactory(0, 'gun_anim');
            socket.emit('shoot', checkShot());
        }
    });
}