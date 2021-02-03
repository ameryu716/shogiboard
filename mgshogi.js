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
    let alpha = 0, beta = 0, gamma = 0,coun = 0;
    const statuss = document.getElementById("status");
    const shogibox = document.getElementById("shogibox");
    
    // ジャイロセンサの値が変化したら実行される deviceorientation イベント
    window.addEventListener("deviceorientation", (e) => {
        alpha = Math.round(e.alpha);  // z軸（表裏）まわりの回転の角度（反時計回りがプラス）
        beta  = -1*Math.round(e.beta)/30;   // x軸（左右）まわりの回転の角度（引き起こすとプラス）
        gamma = Math.round(e.gamma)/30;  // y軸（上下）まわりの回転の角度（右に傾けるとプラス）
    });
    function displayData() {
        // shogirend.rx = alpha;
        // shogirend.ry = beta;
        // shogirend.rz = gamma;
        shogibox.style.transform = "rotate3d("+beta+","+gamma+","+alpha+",45deg)";
        statuss.innerText = alpha+","+beta+","+gamma+"default:"+coun;
    }
    const rend = setInterval(()=>{
        displayData();
        coun++;
    },20)
})