const shogiboard = Vue.component("Shogiboard",{
    template:`
    <div id="grid">
        <div v-for="n in 64" :class="'grid'+n"></div>
    </div>
    `
})
const shogibox = Vue.component("Shogibox",{
    template:`
    <div id="shogibox">
        <Shogiboard></Shogiboard>
        <div class="surface" id="surface2"></div>
        <div class="surface" id="surface3"></div>
        <div class="surface" id="surface4"></div>
        <div class="surface" id="surface5"></div>
        <div class="surface" id="surface6"></div>
    </div>
    `,
    components:{
        "Shogiboard": shogiboard
    }
})
const shogipiece = Vue.component("Targetpiece",{
    template:`
    <div class="piece" id="target">
        <div class="surface surface1"><span>玉</span></div>
        <div class="surface surface2"></div>
        <div class="surface surface3"></div>
        <div class="surface surface4"></div>
        <div class="surface surface5"></div>
        <div class="surface surface6"></div>
    </div>`
}) 
const playerpiece = Vue.component("Playerpiece",{
    template:`
    <div class="piece" id="player">
        <div class="surface surface1"><span>歩</span></div>
        <div class="surface surface2"></div>
        <div class="surface surface3"></div>
        <div class="surface surface4"></div>
        <div class="surface surface5"></div>
        <div class="surface surface6"></div>
    </div>`
}) 

const shogirend = new Vue({
    el: '#wrap',
    components:{
        "Shogibox": shogibox,
        "Piece":shogipiece,
        "Playerpiece":playerpiece
    }
})

const box = document.getElementById("wrap");
const player = document.getElementById("player");
const statuss = document.getElementById("status");

let xr = 0;
let yr = 0;
let playx = 50;
let playy = 500;
// let zr = 0;
let rendinterval;
let ngcontrolinterval;
let clearControlinterval;

document.addEventListener('keydown', (event) => {
    if(event.key=="z"){
        yr = yr+2;
    }
    if(event.key=="x"){
        xr = xr+2;
    }
    if(event.key=="c"){
        yr = yr-2;
    }
    if(event.key=="v"){
        xr = xr-2;
    }
    // time = 0;
}, false);

document.addEventListener('keyup', (event) => {
    if(event.key=="z"){
        yr = 0;
    }
    if(event.key=="x"){
        xr = 0;
    }
    if(event.key=="c"){
        yr = 0;
    }
    if(event.key=="v"){
        xr = 0;
    }
}, false);

function rend(){
    rendinterval = setInterval(()=>{
        box.style.transform = "rotate3d("+yr+","+xr+",0,30deg)";
        playx = playx + xr;
        playy = playy - yr;
        player.style.left = playx+"px";
        player.style.top = playy+"px";
        statuss.innerText = xr+","+yr+",default:";
    },20)
}

function Gamereset(){
    clearInterval(rendinterval);
    clearInterval(ngcontrolinterval);
    xr = 0;
    yr = 0;
    playx = 50;
    playy = 500;
}//ゲームリセット

function Gamestart(){
    rend();
    ngcontrol();
    clearControl();
}//ゲームスタート

function Gameover(){
    Gamereset();
    alert("はみ出してしまった！！");
    // 再スタート
    setTimeout(() => {
        Gamestart();
    }, 500);
}//ゲームオーバー

function Gameclear(){
    Gamereset();
    alert("クリア！！敵を倒しました。");
}

function ngcontrol(){
    ngcontrolinterval = setInterval(()=>{
        if(playx > 700||playy > 700||playx<-100||playy<-100){
            Gameover();
        }
    },20)
}//ゲームオーバー監視

function clearControl(){
    clearControlinterval = setInterval(() => {
        if(playx>280&&playx<290&&playy>10&&playy<20){
            Gameclear();
        }
    }, 20);
}//ゲームクリア監視

Gamestart();
