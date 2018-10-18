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
  // 対応環境
  // getUserMedia によるカメラ映像の取得
  const media = navigator.mediaDevices.getUserMedia({
    video: {facingMode: "user"},
    audio: false
  });

  media.then((stream) => {
    video.src = window.URL.createObjectURL(stream);
  }).catch(
    function (err) {
      //カメラの許可がされなかった場合にエラー
      window.alert("カメラの使用が許可されませんでした");
    }
  );

  // clmtrackr の開始
  let tracker = new clm.tracker();
  // tracker を所定のフェイスモデル（※）で初期化
  tracker.init(pModel);
  // video 要素内でフェイストラッキング開始
  tracker.start(video);

  // 描画ループ
  function drawLoop() {
    // drawLoop 関数を繰り返し実行
    requestAnimationFrame(drawLoop);
    // 顔部品の現在位置の取得
    let positions = tracker.getCurrentPosition();
    // canvas をクリア
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawStamp(positions, stampMouth, 53, 1.5, 0.0, 0.0);
    drawStamp(positions, stampNose, 62, 0.5, 0.0, 0.0);
    drawStamp(positions, stampRightEye, 27, 0.5, 0.0, 0.0);
    drawStamp(positions, stampLeftEye, 32, 0.5, 0.0, 0.0);
    drawStamp(positions, stampRightEar, 13, 0.5, -0.25, 0.0);
    drawStamp(positions, stampLeftEar, 1, 0.5, -0.25, 0.0);
  }

  drawLoop();

  // (顔部品の位置データ, 画像, 基準位置, 大きさ, 横シフト, 縦シフト)
  // 基準位置の参考 => https://github.com/auduno/clmtrackr
  function drawStamp(pos, img, bNo, scale, hShift, vShift) {

    const eyes = pos[32][0] - pos[27][0], // 幅の基準として両眼の間隔を求める
      nose = pos[62][1] - pos[33][1],// 高さの基準として眉間と鼻先の間隔を求める
      wScale = eyes / img.width, // 両眼の間隔をもとに画像のスケールを決める
      imgW = img.width * scale * wScale, // 画像の幅をスケーリング
      imgH = img.height * scale * wScale, // 画像の高さをスケーリング
      imgL = pos[bNo][0] - imgW / 2 + eyes * hShift, // 画像のLeftを決める
      imgT = pos[bNo][1] - imgH / 2 + nose * vShift;// 画像のTopを決める
    // 画像を描く
    context.drawImage(img, imgL, imgT, imgW, imgH);
  }

} else {
  // 非対応環境
  window.alert("WebRTC非対応環境です");
}
