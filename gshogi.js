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

const startdiv =  document.getElementById("startdiv");
const startbtn = document.getElementById("startbtn");
const box = document.getElementById("wrap");
const player = document.getElementById("player");
const target = document.getElementById("target");
const statuss = document.getElementById("status");
const goalfield = document.getElementById("field");
const lifefield = document.getElementById("life");

let targetx = 0;
let targety = 0;

startbtn.onclick = ()=>{
    startdiv.style.display = "none";
    new GameAllControl();
    new EnemyAI();
}

class GameAllControl{
    constructor(){
        this.xr = 0;
        this.yr = 0;
        this.playx = 50;
        this.playy = 500;
        this.clearcount = 0;
        this.rendinterval;
        this.ngcontrolinterval;
        this.clearControlinterval;
        this.keystop = false;
        this.life = 3;
        this.LifeAndDisplaySet();
        this.keyEventSet();
        this.GameReStart();
    }
    LifeAndDisplaySet(){
        for(let i=0;i<this.life;i++){
            let newlife = new Image();
            newlife.src = "./hart.png";
            lifefield.appendChild(newlife);
        }
        player.style.display = "block";
        target.style.display = "block";
        goalfield.style.display = "block";
    }
    keyEventSet(){
        document.addEventListener('keydown', (event) => {
            if(!this.keystop){
                if(event.key == "Right" || event.key == "ArrowRight"){
                    this.xr = 5;
                }
                if(event.key == "Left" || event.key == "ArrowLeft"){
                    this.xr = -5;
                }
                if(event.key == "Up" || event.key == "ArrowUp"){
                    this.yr = 5;
                    event.preventDefault();
                }
                if(event.key == "Down" || event.key == "ArrowDown"){
                    this.yr = -5;
                    event.preventDefault();
                }
                // time = 0;
            }
        }, false);
        document.addEventListener('keyup', (event) => {
            if(!this.keystop){
                if(event.key == "Right" || event.key == "ArrowRight"){
                    this.xr = 0;
                }
                if(event.key == "Left" || event.key == "ArrowLeft"){
                    this.xr = 0;
                }
                if(event.key == "Up" || event.key == "ArrowUp"){
                    this.yr = 0;
                }
                if(event.key == "Down" || event.key == "ArrowDown"){
                    this.yr = 0;
                }
            }
        }, false);
    }
    targetset(){
        targetx = Math.floor(Math.random()*551+10);
        target.style.left = targetx+"px";
        targety = Math.floor(Math.random()*551+10);
        target.style.top = targety+"px";
        // 9~336 random
    }
    rend(){
        this.rendinterval = setInterval(()=>{
            box.style.transform = "rotate3d("+this.yr+","+this.xr+",0,30deg)";
            this.playx = this.playx + this.xr;
            this.playy = this.playy - this.yr;
            player.style.left = this.playx+"px";
            player.style.top = this.playy+"px";
            if(this.playx > 650||this.playy > 650||this.playx<-100||this.playy<-100){
                this.life--;
                if(this.life == 0){
                    this.GameEnd();
                }else{
                    this.Gameover();
                }
                return;
            }//場外
            if(this.playx>targetx-10&&this.playx<targetx+10&&this.playy>targety-10&&this.playy<targety+10){
                this.Gameclear();
                return;
            }//クリア
            statuss.innerText = this.xr+","+this.yr+"クリア回数:"+this.clearcount;
        },20)
    }
    Gamereset(){
        clearInterval(this.rendinterval);
        this.xr = 0;
        this.yr = 0;
        this.playx = 50;
        this.playy = 500;
    }//ゲームリセット
    GameEnd(){
        this.Gamereset();
        setTimeout(() => {
            this.xr = 0;
            this.yr = 0;
            lifefield.removeChild(lifefield.lastChild);
            alert("あなたの負けです。家へお帰り。");
            target.style.display = "none";
            goalfield.style.display = "none";
            player.style.display = "none";
            box.style.transform = "rotate3d("+0+","+0+",0,30deg)";
            startdiv.style.display = "block";
            return;
        }, 500);
    }
    GameReStart(isstart){
        if(isstart||isstart == undefined){
            this.targetset();
            console.log("敵移動します");
            //敵移動
        }
        this.rend();
        this.keystop = false;
    }//ゲームスタート
    Gameover(){
        this.keystop = true;
        this.Gamereset();
        alert("はみ出してしまった！！");
        lifefield.removeChild(lifefield.lastChild);
        // 再スタート
        setTimeout(() => {
            this.GameReStart(false);
        }, 500);
    }//ゲームオーバー
    Gameclear(){
        this.Gamereset();
        alert("クリア！！敵を倒しました。");
        this.clearcount++;
        setTimeout(() => {
            this.GameReStart();
        }, 500);
    }
}

class EnemyAI{
    constructor(){
        this.move();
    }
    directionDice(){
        return Math.floor(Math.random()*8)+1;//return 1~8
    }
    move(){
        setInterval(() => {
            switch(this.directionDice()){
                case 1:
                    if(targety<50){
                        break;
                    }
                    targety-=30;
                    break;
                case 2:
                    if(targetx>500||targety<50){
                        break;
                    }
                    targety-=30;
                    targetx+=30;
                    break;
                case 3:
                    if(targetx>500){
                        break;
                    }
                    targetx+=30;
                    break;
                case 4:
                    if(targetx>500||targety>500){
                        break;
                    }
                    targetx+=30;
                    targety+=30;
                    break;
                case 5:
                    if(targety>500){
                        break;
                    }
                    targety+=30;
                    break;
                case 6:
                    if(targetx<50||targety>500){
                        break;
                    }
                    targetx-=30;
                    targety+=30;
                    break;
                case 7:
                    if(targetx<50){
                        break;
                    }
                    targetx-=30;
                    break;
                case 8:
                    if(targetx<50||targety<50){
                        break;
                    }
                    targetx-=30;
                    targety-=30;
                    break;
                default:
                    console.log(this.directionDice());
            }
            target.style.top = targety+"px";
            target.style.left = targetx+"px";
            goalfield.style.left = targetx-27+"px";
            goalfield.style.top = targety-12+"px";
        }, 50);
    }
}