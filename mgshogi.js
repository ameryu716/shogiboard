//jairogameer>>>
let alpha = 0, beta = 0, gamma = 0;
 
// ジャイロセンサの値が変化したら実行される deviceorientation イベント
window.addEventListener("deviceorientation", (e) => {
    alpha = e.alpha;  // z軸（表裏）まわりの回転の角度（反時計回りがプラス）
    beta  = e.beta;   // x軸（左右）まわりの回転の角度（引き起こすとプラス）
    gamma = e.gamma;  // y軸（上下）まわりの回転の角度（右に傾けるとプラス）
});
 
function displayData() {
    let txt = document.getElementById("root");   // データを表示するdiv要素の取得
    txt.innerHTML = "alpha: " + alpha + "<br>"  // x軸の値
                  + "beta:  " + beta  + "<br>"  // y軸の値
                  + "gamma: " + gamma;          // z軸の値
}

const timer = setInterval(() => {
    displayData();
}, 100);