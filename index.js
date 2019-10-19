var camera;
var canvas;
var ctx;
var model;
var target = null;
var prevTarget = null;

window.onload = async function() {
  model = await cocoSsd.load();
  cameraStart();
};

async function cameraStart() {
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
  camera.onloadedmetadata = () => {
    updateFrame();
  };

  // チャートは常に表示
  drawChart();
}

async function updateFrame() {
  var predictions = await model.detect(camera);
  console.log(predictions);

  target = null;
  for (var i = 0; i < predictions.length; i++) {
    if (predictions[i].class == "bottle") {
      target = predictions[i];
      break;
    }
  }

  // 前フレーム検知なし、今回検知あり（初めて検知）-> ターゲット表示、情報表示
  // 前フレーム検知なし、今回検知なし -> 何もしない
  // 前フレーム検知あり、今回検知あり -> ターゲット削除の上表示、情報は再描画しない
  // 前フレーム検知あり、今回検知なし -> ターゲット削除
  if (prevTarget) {
    clearCanvas();
  }
  if (target) {
    var x = target.bbox[0];
    var y = target.bbox[1];
    var w = target.bbox[2];
    var h = target.bbox[3];

    var centerX = x + w / 2;
    var centerY = y - h / 2;

    var targetImage = new Image();
    targetImage.src = "./images/target.png";
    ctx.drawImage(
      targetImage,
      0,
      0,
      targetImage.width,
      targetImage.height,
      centerX - targetImage.width / 2,
      centerY + targetImage.height / 2,
      targetImage.width,
      targetImage.height
    );
  }

  prevTarget = target;
  requestAnimationFrame(updateFrame);
}

function clearCanvas() {
  // canvas の内容をクリア
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * GoogleのOCR APIを叩く
 */
async function callApi(imageString) {
  var url = "https://vision.googleapis.com/v1/images:annotate";
  var apiKey = "";
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
    options: {
      title: {
        display: false
      },
      scales: {
        xAxes: [
          {
            type: "realtime",
            realtime: {
              delay: 2000,
              onRefresh: function(chart) {
                chart.data.datasets.forEach(function(dataset) {
                  dataset.data.push({
                    x: Math.random(),
                    y: Math.random()
                  });
                });
              }
            }
          }
        ]
      },
      plugins: {
        streaming: {
          duration: 20000,
          refresh: 1000,
          delay: 1000,
          frameRate: 30,
          pause: false,

          onRefresh: function(chart) {
            chart.data.datasets[0].data.push({
              x: Date.now(),
              y: Math.random() * 100
            });
          }
        }
      }
    }
  });
}
