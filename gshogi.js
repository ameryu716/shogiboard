const box = document.getElementById("grid");
let x = 0;
let r = 0;
let time = 0;
let altr = 0;
let engineflag = false;
let seti;

document.addEventListener('keydown', (event) => {
    if(!engineflag){
        engine();
        clearInterval(rotateZ);
    }
    if(event.key=="z"){
        x= x +200;
    }
    if(event.key=="x"){
        r = r+10;
    }
    time = 0;
}, false);

document.addEventListener('keyup', (event) => {
    if(event.key=="x"){
        r = r-5;
    }
}, false);

const engine = function(){
    seti = setInterval(()=>{
        engineflag = true;
        box.style.transform = "translateX("+x+"px) rotateZ("+r+"deg)";
        x = x-3;
        if(x < -3000){
            clearInterval(seti);
        }
        if(time >30000){
            engineflag = false;
            x = 0;
            r=0;
            clearInterval(seti);
            setTimeout(() => {
                rotateZ();
            }, 1000);
        }
        time = time +50;
    },10)
}

function rotateZ(){
    setInterval(()=>{
        box.style.transform = "translateX("+0+"px) rotateZ("+altr+"deg)";
        altr = altr + 10;
    },100)
}