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



//jairogameer>>>
window.addEventListener("load",()=>{
    let alpha = 0, beta = 0, gamma = 0;

    function deviceOrientation( e ){
        //. 通常の処理を無効にする
        e.preventDefault();
        //. スマホの向きを取得
        alpha = Math.round(e.alpha);  // z軸（表裏）まわりの回転の角度（反時計回りがプラス）
        beta  = -1*Math.round(e.beta/10);   // x軸（左右）まわりの回転の角度（引き起こすとプラス）
        gamma = Math.round(e.gamma/10);  // y軸（上下）まわりの回転の角度（右に傾けるとプラス）
    }
    
    function ClickRequestDeviceSensor(){
        //. ユーザーに「許可」を求めるダイアログを表示
        DeviceOrientationEvent.requestPermission().then( function( response ){
            if( response === 'granted' ){
                //. 許可された場合のみイベントハンドラを追加できる
                window.addEventListener( "deviceorientation", deviceOrientation );
                //. 画面上部のボタンを消す
                document.getElementById("sensorrequest").style.display = "none";
            }
        }).catch( function( e ){
            console.log( e );
        });
    }
        
    //. DeviceOrientationEvent オブジェクトが有効な環境か？　をチェック
    if( window.DeviceOrientationEvent ){
        //. iOS13 以上であれば DeviceOrientationEvent.requestPermission 関数が定義されているので、ここで条件分岐
        if( DeviceOrientationEvent.requestPermission && typeof DeviceOrientationEvent.requestPermission === 'function' ){
            //. iOS 13 以上の場合、
            //. 画面上部に「センサーの有効化」ボタンを追加
            const banner = document.createElement("div");
            banner.style.zIndex = "1";
            banner.style.position = "absolute"; 
            banner.style.width = "100%";
            banner.style.backgroundColor="#000";
            banner.onclick = ()=>{
                ClickRequestDeviceSensor();
            }
            banner.id = "sensorrequest";
            banner.innerHTML = "<p style='color: rgb(0, 0, 255);'>センサーの有効化</p>";
            document.body.appendChild(banner);
        }else{
            //. Android または iOS 13 未満の場合、
            //. DeviceOrientationEvent オブジェクトが有効な場合のみ、deviceorientation イベント発生時に deviceOrientaion 関数がハンドリングするよう登録
            window.addEventListener( "deviceorientation", deviceOrientation );
        }
    }
    
    const box = document.getElementById("wrap");
    const player = document.getElementById("player");
    const target = document.getElementById("target");
    const statuss = document.getElementById("status");

    let playx = 25;
    let playy = 318;
    let targetx = 0;
    let clearcount = 0;
    let rendinterval;
    let ngcontrolinterval;
    let clearControlinterval;

    function targetset(){
        targetx = Math.floor(Math.random()*327+9);
        target.style.left = targetx+"px";
        // 9~336 random
    }

    function rend(){
        rendinterval = setInterval(()=>{
            box.style.transform = "rotate3d("+beta+","+gamma+",0,30deg)";
            playx = playx + 2*gamma;
            playy = playy - 2*beta;
            player.style.left = playx+"px";
            player.style.top = playy+"px";
            statuss.innerText = alpha+","+beta+","+gamma+"クリア回数:"+clearcount;
        },20)
    }

    function Gamereset(){
        clearInterval(rendinterval);
        clearInterval(ngcontrolinterval);
        playx = 25;
        playy = 318;
    }//ゲームリセット

    function Gamestart(isstart){
        if(isstart||isstart == undefined){
            targetset();
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
            if(playx > 400||playy > 400||playx<-50||playy<-50){
                Gameover();
            }
        },20)
    }//ゲームオーバー監視

    function clearControl(){
        clearControlinterval = setInterval(() => {
            if(playx>targetx-5&&playx<targetx+5&&playy>18&&playy<28){
                Gameclear();
            }
        }, 20);
    }//ゲームクリア監視

    Gamestart();
})