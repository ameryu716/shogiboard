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
    <div id="shogibox" :style='"transform: rotate3d("+rx+","+ry+",0,"+rz+"deg);"'>
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

// const box = document.getElementById("grid");
// let xr = 0;
// let yr = 0;
// let zr = 0;

// document.addEventListener('keydown', (event) => {
//     if(event.key=="z"){
//         xr++;
//         zr = zr+5;
//         // xr = xr +5;
//     }
//     if(event.key=="x"){
//         yr++;
//         zr = zr+5;
//         // yr = yr+5;
//     }
//     // time = 0;
// }, false);





//jairogameer>>>
let alpha = 0, beta = 0, gamma = 0;
 
// ジャイロセンサの値が変化したら実行される deviceorientation イベント
window.addEventListener("deviceorientation", (e) => {
    alpha = e.alpha;  // z軸（表裏）まわりの回転の角度（反時計回りがプラス）
    beta  = e.beta;   // x軸（左右）まわりの回転の角度（引き起こすとプラス）
    gamma = e.gamma;  // y軸（上下）まわりの回転の角度（右に傾けるとプラス）
});
function displayData() {
    shogirend.rx = alpha;
    shogirend.ry = beta;
    shogirend.rz = gamma;
}
const rend = setInterval(()=>{
    displayData();
},20)