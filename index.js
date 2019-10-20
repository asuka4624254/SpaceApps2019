var camera;
var canvas;
var ctx;
var model;
var target = null;
var prevTarget = null;

var chartPointer = 0;
var chartStack = [];

var donutWave = [
  0.0,
  0.0,
  0.0,
  -166.0,
  -1900.0,
  -4214.0,
  -3744.0,
  -1964.0,
  -290.0,
  2332.0,
  3944.0,
  2970.0,
  1342.0,
  698.0,
  0.0,
  0.0,
  -147.0,
  -447.0,
  -762.0,
  -2419.0,
  -4494.0,
  -3656.0,
  -1721.0,
  -381.0,
  1898.0,
  3423.0,
  2577.0,
  1632.0,
  1433.0,
  0.0,
  0.0,
  -867.0,
  -1917.0,
  -2268.0,
  -2766.0,
  -3784.0,
  -2978.0,
  -1305.0,
  -343.0,
  1076.0,
  1932.0,
  1510.0,
  1941.0,
  2338.0,
  0.0,
  0.0,
  -2058.0,
  -3176.0,
  -3005.0,
  -1610.0,
  -1356.0,
  -1950.0,
  -1322.0,
  -128.0,
  569.0,
  505.0,
  794.0,
  1955.0,
  1968.0,
  0.0,
  0.0,
  -2553.0,
  -2435.0,
  -1612.0,
  286.0,
  878.0,
  -1305.0,
  -2123.0,
  -723.0,
  522.0,
  639.0,
  1064.0,
  1775.0,
  1044.0,
  0.0,
  0.0,
  -1779.0,
  -505.0,
  392.0,
  1268.0,
  1524.0,
  -826.0,
  -2666.0,
  -1887.0,
  557.0,
  1709.0,
  1325.0,
  1316.0,
  725.0,
  0.0,
  0.0,
  -676.0,
  876.0,
  1304.0,
  713.0,
  378.0,
  -553.0,
  -1571.0,
  -1602.0,
  405.0,
  1685.0,
  1060.0,
  1315.0,
  1256.0,
  0.0,
  0.0,
  -758.0,
  583.0,
  1032.0,
  -159.0,
  -626.0,
  2.0,
  141.0,
  -593.0,
  -191.0,
  480.0,
  842.0,
  2535.0,
  2858.0,
  0.0,
  0.0,
  -2600.0,
  -1768.0,
  -129.0,
  -75.0,
  699.0,
  1960.0,
  901.0,
  -1447.0,
  -1665.0,
  -556.0,
  1021.0,
  4494.0,
  5357.0,
  0.0,
  0.0,
  -3908.0,
  -3398.0,
  -890.0,
  256.0,
  2032.0,
  3364.0,
  976.0,
  -2542.0,
  -2658.0,
  -890.0,
  1204.0,
  5516.0,
  6720.0,
  0.0
];
var bottleWave = [
  0.0,
  -4502.0,
  -4384.0,
  -1334.0,
  1612.0,
  4136.0,
  4116.0,
  1924.0,
  638.0,
  0.0,
  0.0,
  -4298.0,
  -3935.0,
  -1118.0,
  1339.0,
  3432.0,
  3697.0,
  2519.0,
  1527.0,
  0.0,
  0.0,
  -3368.0,
  -2648.0,
  -554.0,
  770.0,
  1818.0,
  2389.0,
  3119.0,
  3019.0,
  0.0,
  0.0,
  -2024.0,
  -1331.0,
  -74.0,
  504.0,
  748.0,
  909.0,
  2412.0,
  3359.0,
  0.0,
  0.0,
  -957.0,
  -653.0,
  -80.0,
  607.0,
  809.0,
  173.0,
  1223.0,
  2757.0,
  0.0,
  0.0,
  -68.0,
  -282.0,
  -419.0,
  484.0,
  989.0,
  120.0,
  852.0,
  2435.0,
  0.0,
  0.0,
  470.0,
  -178.0,
  -739.0,
  70.0,
  779.0,
  428.0,
  1355.0,
  2703.0,
  0.0,
  0.0,
  306.0,
  -449.0,
  -839.0,
  -174.0,
  492.0,
  698.0,
  2131.0,
  3439.0,
  0.0,
  0.0,
  -498.0,
  -881.0,
  -753.0,
  -176.0,
  334.0,
  654.0,
  2488.0,
  4011.0,
  0.0,
  0.0,
  -1952.0,
  -1495.0,
  -605.0,
  -115.0,
  300.0,
  465.0,
  1929.0,
  3233.0,
  0.0,
  0.0,
  -3745.0,
  -2273.0,
  -397.0,
  33.0,
  324.0,
  331.0,
  889.0,
  1433.0,
  0.0,
  0.0,
  -4929.0,
  -2724.0,
  -139.0,
  182.0,
  286.0,
  231.0,
  242.0,
  256.0,
  0.0,
  0.0,
  -5110.0,
  -2382.0,
  238.0,
  110.0,
  79.0,
  58.0,
  -50.0,
  -66.0,
  0.0,
  0.0,
  -4803.0,
  -1424.0,
  810.0,
  -144.0,
  -207.0,
  -156.0,
  -449.0,
  -365.0,
  0.0,
  0.0,
  -4618.0,
  -866.0,
  1136.0,
  -288.0,
  -342.0,
  -254.0,
  -700.0,
  -584.0,
  0.0
];

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
    if (predictions[i].class == "donut" || predictions[i].class == "bottle") {
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
    // チャートにデータをセット
    target.class == "donut"
      ? addChartStack(donutWave)
      : addChartStack(bottleWave);
    // サウンド鳴らす
    playSound(target.class);

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
  var url = "http://172.30.2.31:8080";
  var body = {
    requests: [
      {
        image: {
          content: imageString
        }
      }
    ]
  };

  try {
    var res = await fetch(url, {
      method: "POST"
      // body: JSON.stringify(body)
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

function drawChart() {
  var chart = document.getElementById("chart");
  var ctx = chart.getContext("2d");

  var chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Space Apps Challenge 2019"],
      datasets: [
        {
          label: "Don't think, touch!",
          borderColor: "rgb(4, 191, 191)",
          data: []
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
              ttl: 60000,
              delay: 2000,
              onRefresh: function(chart) {
                chart.data.datasets.forEach(function(dataset) {
                  if (chartStack[chartPointer] == undefined) {
                    dataset.data.push({
                      x: Date.now(),
                      y: 0
                    });
                  } else {
                    dataset.data.push({
                      x: Date.now(),
                      y: chartStack[chartPointer]
                    });
                    chartPointer++;
                  }
                });
              }
            }
          }
        ]
      }
    }
  });
}

function addChartStack(data) {
  chartStack = data;
  chartPointer = 0;
}

function playSound(name) {
  audio = document.getElementById(name);
  audio.play();
}
