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

const box = document.getElementById("grid");
const statuss = document.getElementById("status");
let xr = 0;
let yr = 0;
let zr = 0;

document.addEventListener('keydown', (event) => {
    // if(!engineflag){
    //     engine();
    //     clearInterval(rotateZ);
    // }
    if(event.key=="z"){
        xr++;
        zr = zr+5;
        // xr = xr +5;
    }
    if(event.key=="x"){
        yr++;
        zr = zr+5;
        // yr = yr+5;
    }
    // time = 0;
}, false);

// document.addEventListener('keyup', (event) => {
//     if(event.key=="x"){
//         r = r-5;
//     }
// }, false);

// const engine = function(){
//     seti = setInterval(()=>{
//         engineflag = true;
//         box.style.transform = "translateX("+x+"px) rotateZ("+r+"deg)";
//         x = x-3;
//         if(x < -3000){
//             clearInterval(seti);
//         }
//         if(time >30000){
//             engineflag = false;
//             x = 0;
//             r=0;
//             clearInterval(seti);
//             setTimeout(() => {
//                 rotateZ();
//             }, 1000);
//         }
//         time = time +50;
//     },10)
// }

function rend(){
    setInterval(()=>{
        shogirend.rx = xr;
        shogirend.ry = yr;
        shogirend.rz = zr;
        statuss.innerText = xr+","+yr+","+zr;
    },20)
}
rend();

setInterval(() => {
    if(xr>0){
        xr--;
    }
    if(yr>0){
        yr--;
    }
}, 250);