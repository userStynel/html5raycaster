var map_file_list = [];
const NUMBER_OF_DEFAULT_MAP = 2;
function loadingDefaultMap(){
    let map_selector = document.getElementById('mapselector');
    for(let i = 0; i<NUMBER_OF_DEFAULT_MAP; i++){
        let op = new Option(`기본맵 #${i}` , i, false, true);
        map_selector.add(op);
    }
}

function click_Game_Btn(){
    let button = document.getElementById('start-pause');
    if(!playMode){
            let map_selector = document.getElementById('mapselector');
            let selectedIdx = map_selector.selectedIndex;
            if(selectedIdx >= NUMBER_OF_DEFAULT_MAP){
                let idx = selectedIdx - NUMBER_OF_DEFAULT_MAP;
                if(map_file_list[idx] == undefined)
                {
                    alert('맵 업로드 에러');
                    return;
                }
                else
                    socket.emit('click_game_start', {defaultMap:false, data:map_file_list[idx]});
            }
            else{
                socket.emit('click_game_start', {defaultMap:true, idx:selectedIdx});
            }
            button.innerText = "GAME STOP!";
    }
    else{
        socket.emit('click_game_broken','');
        button.innerText = "GAME START!";
    }
}

function ADMIN_INIT(){
    loadingDefaultMap();
    let map_uploader = document.getElementById('map_uploader');
    if(map_uploader != undefined){
        map_uploader.addEventListener('change', ()=>{
            let file = map_uploader.files[0];
                let reader = new FileReader();
                reader.addEventListener('load', (e)=>{
                    try{
                        let map_data = JSON.parse(e.target.result);
                        let map_selector = document.getElementById('mapselector');
                        let op = new Option(`${map_data.name}` , map_selector.length, false, true);
                        map_selector.add(op);
                        map_file_list.push(map_data);
                    }
                    catch{
                        alert('맵 파일을 읽어오는 데 실패했습니다!');
                        return;
                    }
                })
            reader.readAsText(file);
        });
    }
}