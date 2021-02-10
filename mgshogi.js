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
        this.alpha = 0;
        this.beta = 0;
        this.gamma = 0;
        this.playx = 25;
        this.playy = 318;
        this.clearcount = 0;
        this.rendinterval;
        this.life = 3;
        this.LifeAndDisplaySet();
        this.DeviceGyroEventSet();
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
    deviceOrientation(e){
        //. 通常の処理を無効にする
        e.preventDefault();
        //. スマホの向きを取得
        this.alpha = Math.round(e.alpha);  // z軸（表裏）まわりの回転の角度（反時計回りがプラス）
        this.beta  = -1*Math.round(e.beta/5);   // x軸（左右）まわりの回転の角度（引き起こすとプラス）
        this.gamma = Math.round(e.gamma/5);  // y軸（上下）まわりの回転の角度（右に傾けるとプラス）
    }
    ClickRequestDeviceSensor(){
        //. ユーザーに「許可」を求めるダイアログを表示
        DeviceOrientationEvent.requestPermission().then( function( response ){
            if( response === 'granted' ){
                //. 許可された場合のみイベントハンドラを追加できる
                window.addEventListener( "deviceorientation", deviceOrientation );
                //. 画面上部のボタンを消す
                // document.getElementById("sensorrequest").style.display = "none";
            }
        }).catch( function( e ){
            console.log( e );
        });
    }
    DeviceGyroEventSet(){
        //. DeviceOrientationEvent オブジェクトが有効な環境か？　をチェック
        if( window.DeviceOrientationEvent ){
            //. iOS13 以上であれば DeviceOrientationEvent.requestPermission 関数が定義されているので、ここで条件分岐
            if( DeviceOrientationEvent.requestPermission && typeof DeviceOrientationEvent.requestPermission === 'function' ){
                //. iOS 13 以上の場合、
                //. 画面上部に「センサーの有効化」ボタンを追加
                // const banner = document.createElement("div");
                // banner.style.zIndex = "1";
                // banner.style.position = "absolute"; 
                // banner.style.width = "100%";
                // banner.style.backgroundColor="#000";
                // banner.onclick = ()=>{
                //     ClickRequestDeviceSensor();
                // }
                // banner.id = "sensorrequest";
                // banner.innerHTML = "<p style='color: rgb(0, 0, 255);'>センサーの有効化</p>";
                // document.body.appendChild(banner);
                if(confirm("「将棋ジャイロ」がジャイロセンサーへのアクセスを要求しています。許可してよろしいですか？（許可しないとゲームが遊べません。）")){
                    this.ClickRequestDeviceSensor();
                }else{
                    alert("ゲームが遊べません。リセットする場合はページをもう一度読み込んでください。");
                }
            }else{
                //. Android または iOS 13 未満の場合、
                //. DeviceOrientationEvent オブジェクトが有効な場合のみ、deviceorientation イベント発生時に deviceOrientaion 関数がハンドリングするよう登録
                window.addEventListener("deviceorientation", this.deviceOrientation);
            }
        }
    }
    targetset(){
        targetx = Math.floor(Math.random()*327+9);
        target.style.left = targetx-17+"px";
        targety = Math.floor(Math.random()*327+9);
        target.style.top = targety-17+"px";
        // 9~336 random
    }
    rend(){
        this.rendinterval = setInterval(()=>{
            box.style.transform = "rotate3d("+this.beta+","+this.gamma+",0,30deg)";
            this.playx = this.playx +2*this.gamma;
            this.playy = this.playy -2*this.beta;
            player.style.left = this.playx+"px";
            player.style.top = this.playy+"px";
            if(this.playx > 400||this.playy > 400||this.playx<-50||this.playy<-50){
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
            statuss.innerText = this.alpha+","+this.beta+","+this.gamma+"クリア回数:"+this.clearcount;
        },20)
    }
    Gamereset(){
        clearInterval(this.rendinterval);
        this.playx = 25;
        this.playy = 318;
    }//ゲームリセット
    GameEnd(){
        this.Gamereset();
        setTimeout(() => {
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
    }//ゲームスタート
    Gameover(){
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
                    if(targetx>300||targety<50){
                        break;
                    }
                    targety-=30;
                    targetx+=30;
                    break;
                case 3:
                    if(targetx>300){
                        break;
                    }
                    targetx+=30;
                    break;
                case 4:
                    if(targetx>300||targety>300){
                        break;
                    }
                    targetx+=30;
                    targety+=30;
                    break;
                case 5:
                    if(targety>300){
                        break;
                    }
                    targety+=30;
                    break;
                case 6:
                    if(targetx<50||targety>300){
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