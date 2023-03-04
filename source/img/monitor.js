const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let data = []; // 保存历史数据

function fetchData() {
  fetch("http://1.15.82.181:8080/qo/download/status")
    .then(response => response.json())
    .then(json => {
      data.push({ mspt_3s: json.mspt_3s, mspt: json.mspt });
      if (data.length * 5 > canvas.width) {
        data.shift();
      }
      draw();
    })
    .catch(error => console.error(error));
}

function draw() {
  // 清空画布
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  buffer = data.length * 10 - canvas.width + 20;
  // 绘制折线图
  ctx.beginPath();
  ctx.lineWidth = 2;
  ctx.moveTo(-buffer, canvas.height - data[0].mspt * canvas.height / 70);
  for (let i = 1; i < data.length; i++) {
    ctx.strokeStyle = getColor(data[i].mspt);
    ctx.lineTo(i * 10 - buffer, canvas.height - data[i].mspt * canvas.height / 70);
    ctx.fillStyle = "#000";
    ctx.fillRect(i * 10 - buffer, canvas.height - data[i].mspt_3s * canvas.height / 70, 1, 1);
    var str = `${Math.round(data[i].mspt*100)}`
    if (((i + 1) % 5 === 0) && !(i === data.length - 1)) {
      ctx.fillStyle = 'black';
      ctx.font = '12px Arial';
      ctx.fillText(str.substring(0,str.length-2)+"."+str.substring(str.length-2), i * 10 - buffer, canvas.height - data[i].mspt_3s * canvas.height / 70 + 18);
    }
    
    if (i === data.length - 1) {
      ctx.fillStyle = 'black';
      ctx.font = '12px Arial';
      ctx.fillText(str.substring(0,str.length-2)+"."+str.substring(str.length-2), i * 10 - buffer, canvas.height - data[i].mspt_3s * canvas.height / 70 + 5);
    }
    ctx.stroke();
  }
}

function getColor(val) {
  if(val>=50) return "#ff0000";
  else {
    color = Math.round(val * 4.8)*256+255-Math.round(val * 4.8);
    return "#"+color.toString(16).padStart(4, '0')+"00";
  }
}

setInterval(fetchData, 3000);