var camera;
var canvas;
var ctx;

var noMoreUpdate = false;

window.onload = async function() {
  camera = document.getElementById("camera");
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");

  var constraints = {
    audio: false,
    video: {
      facingMode: "environment"
    }
  };

  // カメラから画像を取得してリアルタイムで表示する
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    return;
  }

  var stream = await navigator.mediaDevices.getUserMedia(constraints);
  camera.srcObject = stream;

  canvas.width = camera.clientWidth;
  canvas.height = camera.clientHeight;
  updateFrame();
};

async function updateFrame() {
  if (noMoreUpdate) return;

  var model = await cocoSsd.load();
  var predictions = await model.detect(camera);
  console.log(predictions);

  // canvas の内容をクリア
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (var i = 0; i < predictions.length; i++) {
    var obj = predictions[i];
    var box = obj.bbox;
    drawRect(box[0], box[1], box[2], box[3]);
    drawLabel(
      obj["class"] + " : " + parseInt(obj["score"] * 100, 10) + "%",
      box[0],
      box[1]
    );
  }

  drawChart();
  requestAnimationFrame(updateFrame);
}

/**
 * GoogleのOCR APIを叩く
 */
async function callApi(imageString) {
  var url = "https://vision.googleapis.com/v1/images:annotate";
  var apiKey = "AIzaSyBePpoAr3J_W-FdbZGMgYRhDopY4Emlf7w";
  var apiUrl = url + "?key=" + apiKey;

  var body = {
    requests: [
      {
        image: {
          content: imageString
        },
        features: {
          type: "TEXT_DETECTION"
        }
      }
    ]
  };

  try {
    var res = await fetch(apiUrl, {
      method: "POST",
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      throw new Error();
    }
  } catch (e) {
    console.log("Oops! Some error occurred. " + JSON.stringify(e));
    return;
  }

  return res.json();
}

function drawRect(x, y, w, h) {
  ctx.beginPath();
  ctx.rect(parseInt(x, 10), parseInt(y, 10), parseInt(w, 10), parseInt(h, 10));
  ctx.strokeStyle = "rgb(50, 240, 60)";
  ctx.lineWidth = 8;
  ctx.stroke();
  ctx.closePath();
}

function drawLabel(text, x, y) {
  ctx.beginPath();
  ctx.rect(x - 5, y - 20, 140, 20);
  ctx.fillStyle = "rgb(50, 240, 60)";
  ctx.fill();
  ctx.closePath();

  ctx.beginPath();
  ctx.font = "18px 'ＭＳ Ｐゴシック'";
  ctx.fillStyle = "red";
  ctx.fillText(text, parseInt(x, 10), parseInt(y, 10));
  ctx.closePath();
}

function drawChart() {
  var chart = document.getElementById("chart");
  var ctx = chart.getContext("2d");

  var chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
      datasets: [
        {
          borderColor: "rgb(255, 99, 132)",
          data: [0, 10, 5, 2, 20, 30, 45, 0, 10, 5, 2, 20, 30, 45]
        }
      ]
    },
    options: {}
  });
}
