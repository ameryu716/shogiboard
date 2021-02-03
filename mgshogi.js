const shogiboard = Vue.component("Shogiboard",{
    template:`
    <div id="grid">
        <div v-for="n in 64" :class="'grid'+n"></div>
    </div>
    `
})
const shogibox = Vue.component("Shogibox",{
    props: {
        rx: Number,
        ry: Number,
        rz: Number,
    },
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
const shogirend = new Vue({
    el: '#wrap',
    data: {
        rx: 0,
        ry: 0,
        rz: 0,
    },
    components:{
        "Shogibox": shogibox
    }
})

//  :style='"transform: rotate3d("+rx+","+ry+",0,"+rz+"deg);"'


//jairogameer>>>
window.addEventListener("load",()=>{
    let alpha = 0, beta = 0, gamma = 0;
    const statuss = document.getElementById("status");
    const shogibox = document.getElementById("shogibox");

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
    

    const rend = setInterval(()=>{
        shogibox.style.transform = "rotate3d("+beta+","+gamma+",0,30deg)";
        statuss.innerText = alpha+","+beta+","+gamma+"default:";
    },20)
    
})