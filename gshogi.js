const shogiboard = Vue.component("Shogiboard",{
    template:`
    <div id="grid">
        <div v-for="n in 81" :class="'grid'+n"></div>
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
        <div class="surface surface1"><span>玉<br>将</span></div>
        <div class="surface surface2"></div>
        <div class="surface surface3"></div>
        <div class="surface surface4"></div>
        <div class="surface surface5"></div>
        <div class="surface surface6"></div>
        <div class="surface surface7"></div>
    </div>`
}) 
const playerpiece = Vue.component("Playerpiece",{
    template:`
    <div class="piece" id="player">
        <div class="surface surface1"><span>歩<br>兵</span></div>
        <div class="surface surface2"></div>
        <div class="surface surface3"></div>
        <div class="surface surface4"></div>
        <div class="surface surface5"></div>
        <div class="surface surface6"></div>
        <div class="surface surface7"></div>
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
const target = document.getElementById("target");
const statuss = document.getElementById("status");
const goalfield = document.getElementById("field");

let xr = 0;
let yr = 0;
let playx = 50;
let playy = 500;
let targetx = 0;
let clearcount = 0;
let rendinterval;
let ngcontrolinterval;
let clearControlinterval;

document.addEventListener('keydown', (event) => {
    if(event.key == "Right" || event.key == "ArrowRight"){
        xr = xr+5;
    }
    if(event.key == "Left" || event.key == "ArrowLeft"){
        xr = xr-5;
    }
    if(event.key == "Up" || event.key == "ArrowUp"){
        yr = yr+5;
        event.preventDefault();
    }
    if(event.key == "Down" || event.key == "ArrowDown"){
        yr = yr-5;
        event.preventDefault();
    }
    // time = 0;
}, false);

document.addEventListener('keyup', (event) => {
    if(event.key == "Right" || event.key == "ArrowRight"){
        xr = 0;
    }
    if(event.key == "Left" || event.key == "ArrowLeft"){
        xr = 0;
    }
    if(event.key == "Up" || event.key == "ArrowUp"){
        yr = 0;
    }
    if(event.key == "Down" || event.key == "ArrowDown"){
        yr = 0;
    }
}, false);

function targetset(){
    targetx = Math.floor(Math.random()*551+10);
    target.style.left = targetx+"px";
    goalfield.style.left = targetx-27+"px";
    // 9~336 random
}

function rend(){
    rendinterval = setInterval(()=>{
        box.style.transform = "rotate3d("+yr+","+xr+",0,30deg)";
        playx = playx + xr;
        playy = playy - yr;
        player.style.left = playx+"px";
        player.style.top = playy+"px";
        statuss.innerText = xr+","+yr+"クリア回数:"+clearcount;
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

function Gamestart(isstart){
    if(isstart||isstart == undefined){
        targetset();
        console.log("敵移動します");
        //敵移動
    }
    rend();
    ngcontrol();
    clearControl();
}//ゲームスタート

function Gameover(){
    Gamereset();
    alert("はみ出してしまった！！");
    // 再スタート
    setTimeout(() => {
        Gamestart(false);
    }, 500);
}//ゲームオーバー

function Gameclear(){
    Gamereset();
    alert("クリア！！敵を倒しました。");
    clearcount++;
    setTimeout(() => {
        Gamestart();
    }, 500);
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
        if(playx>targetx-10&&playx<targetx+10&&playy>14&&playy<31){
            Gameclear();
        }
    }, 20);
}//ゲームクリア監視

Gamestart();
