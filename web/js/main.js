const video = document.getElementById("video"),
  canvas = document.getElementById("canvas"),
  context = canvas.getContext("2d"),
  stampMouth = new Image(),
  stampNose = new Image(),
  stampRightEye = new Image(),
  stampLeftEye = new Image(),
  stampRightEar = new Image(),
  stampLeftEar = new Image();

stampMouth.src = "./images/voe/voe_mouth.png";
stampNose.src = "./images/voe/voe_nose.png";
stampRightEye.src = "./images/voe/voe_eye.png";
stampLeftEye.src = "./images/voe/voe_eye.png";
stampRightEar.src = "./images/voe/voe_left_ear.png";
stampLeftEar.src = "./images/voe/voe_right_ear.png";

if (!!navigator.mediaDevices && !!navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia({audio: false, video: {facingMode: "user"}})
    .then(function (stream) {
      try {
        video.srcObject = stream;
      } catch (err) {
        video.src = URL.createObjectURL(stream);
      }
    })
    .catch(function (err) {
      console.log(err.message);
      window.alert("カメラの使用が許可されませんでした");
    });

  var tracker = new clm.tracker();
  // tracker を所定のフェイスモデル（※）で初期化
  tracker.init(pModel);
  // video 要素内でフェイストラッキング開始
  tracker.start(video);

  function drawLoop() {
    requestAnimationFrame(drawLoop);
    // 顔部品の現在位置の取得
    let positions = tracker.getCurrentPosition();
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawStamp(positions, stampMouth, 53, 1.5, 0.0, 0.0);
    drawStamp(positions, stampNose, 62, 0.5, 0.0, 0.0);
    drawStamp(positions, stampRightEye, 27, 0.5, 0.0, 0.0);
    drawStamp(positions, stampLeftEye, 32, 0.5, 0.0, 0.0);
    drawStamp(positions, stampRightEar, 13, 0.5, -0.25, 0.0);
    drawStamp(positions, stampLeftEar, 1, 0.5, -0.25, 0.0);
  }

  drawLoop();

  // 基準位置の参考 => https://github.com/auduno/clmtrackr
  function drawStamp(pos, img, bNo, scale, hShift, vShift) {
    const eyes = pos[32][0] - pos[27][0], // 幅の基準として両眼の間隔を求める
      nose = pos[62][1] - pos[33][1],// 高さの基準として眉間と鼻先の間隔を求める
      wScale = eyes / img.width, // 両眼の間隔をもとに画像のスケールを決める
      imgW = img.width * scale * wScale,
      imgH = img.height * scale * wScale,
      imgL = pos[bNo][0] - imgW / 2 + eyes * hShift,
      imgT = pos[bNo][1] - imgH / 2 + nose * vShift;
    context.drawImage(img, imgL, imgT, imgW, imgH);
  }

} else {
  window.alert("WebRTC非対応環境です");
}
