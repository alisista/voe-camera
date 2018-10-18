(function () {
  // DOM
  var wrapper = document.getElementById("wrapper");
  var inner = document.getElementById("inner");

  // マスクを描画するcanvas
  var maskCanvas;
  // 画像が表示されるcanvas
  var imageCanvas = document.getElementById("image");
  var imageContext = image.getContext("2d");

  // 顔のワイヤーフレームが表示されるcanvas
  var wireframe = document.getElementById("wireframe");
  var wireframeContext = wireframe.getContext("2d");

  // input file
  var inputFile = document.getElementById("inputFile");

  // ログ表示用
  var log = document.getElementById("log");

  // マスク画像
  var maskUrl = "images/mask.jpg";
  // マスクの頂点データ
  var maskData = [
    [266.539778613571, 254.84378898872825], [266.3039097561577, 285.302233189556], [271.19357329466345, 316.3538789507933], [278.7139543521674, 345.15573844972926], [293.15712497356776, 368.9809024015706], [312.64193974141324, 389.09850232246515], [322.13343587641253, 398.3663601209212], [336.9858985066435, 401.49456958745145], [356.87519225850986, 398.5376499254816], [382.97232156668036, 391.79752653535775], [421.61286401088506, 373.50434543677886], [448.74322775690695, 344.0259953810623], [464.77440099078314, 310.71915538180275], [468.2775933241595, 272.2241198406615], [466.74514645738424, 247.20492682906303], [415.26964981149064, 225.8370550250565], [390.13712322351404, 222], [361.92175039938184, 220.2582273389706], [342.2734356138508, 232.04834635926073], [267.7624903928149, 236.00873885152805], [280.88607721372824, 229], [303.9033677258633, 228], [316.6965360192193, 234.20369314639848], [281.57998031880885, 254.77971856631495], [298.953459306752, 246.21641370334032], [315.75345517431316, 254.4516165242651], [296.6631361379687, 258.36486568494297], [301.63327656416925, 252.0239926097512], [398.27491865673994, 249.8954346966754], [380.22403819342355, 243.83584281695727], [357.98660716766716, 253.53119540181672], [378.25469629277825, 255.99515336941278], [382.6139465907322, 249.6433274231842], [328, 253], [314.73794539936216, 301.757722929817], [309.85213116736014, 314.6797549304112], [313.1507370768973, 321.4994076914073], [325.20473159190635, 327.87953636258146], [350.1231795924951, 324.5425216268138], [358.3783946629097, 316.6717252774034], [352.7986254362873, 299.5519517987678], [326, 282], [314.75674487301336, 318.32005216616164], [343.0322275619273, 319.2819917007706], [307.87514392633693, 346.0346979532304], [316.68926117981914, 342.91320569661593], [321.7320399187087, 341.45780089974846], [327.8558316510405, 343.56649844038935], [336.18423231506125, 341.74737597014604], [351.00603891713007, 342.2560527375472], [367.88222498993025, 344.3660717427479], [357.305053617142, 354.4583428810625], [343.5761668856892, 358.8848818975423], [328.82001419900075, 359.1051832365163], [320.36190636746045, 358.71759346010083], [312.61714975606304, 353.5625007817836], [318.4988566294063, 348.1744254793423], [328.6406599928464, 349.73460503451736], [350.2480353796336, 349.6831133201238], [349.5754234743516, 349.5362145583936], [329.32557946752445, 349.67345155068153], [318.2253756678819, 347.9222277142419], [324.4964277572599, 315.63122813643895], [288.26630901657126, 248.99890899333045], [309.3536455351319, 248.83485523505226], [307.7075352919804, 256.40978560947974], [288.62032608071166, 258.5736833679789], [390.2498028902113, 244.8663932568382], [368.1047796233772, 247.18427292360775], [368.62079313091925, 255.76448975973483], [390.7655312307384, 254.4464699123733]
  ];
  // マスクを描画するクラス
  var fd;

  // clmtrackr
  var ctrack;

  // 描画用RequestAnimationFrame
  var drawRequest;

  // 処理開始
  start();

  /**
   * 処理開始
   */
  function start() {
    // clmtrackrをインスタンス化
    ctrack = new clm.tracker();

    // 初期読み込み用の画像のURL
    var imgPath = "./images/example.jpg";

    // 画像の読み込み
    // JavaScript Load Imageライブラリを使用
    // https://github.com/blueimp/JavaScript-Load-Image
    loadImage(imgPath, function (img) {
      drowLog("顔検出中...");
      // 読み込んだ画像をcanvasへ描画
      drawImage(img);

      // 画像ファイルの読み込み
      inputFile.addEventListener("change", fileChangeHandler);
    });
  }

  /**
   * 繰り返し処理
   */
  function loop() {
    // requestAnimationFrame
    drawRequest = requestAnimationFrame(loop);

    // canvasの描画をクリア
    wireframeContext.clearRect(0, 0, wireframe.width, wireframe.height);

    // 座標が取得できたかどうか
    if (ctrack.getCurrentPosition()) {
      // ワイヤーフレームをcanvasへ描画
      ctrack.draw(wireframe);
    }
  }

  /**
   * 画像ファイルを選択
   * @param event
   */
  function fileChangeHandler(event) {
    // 繰り返し処理停止
    cancelAnimationFrame(drawRequest);

    // Remove Event
    document.removeEventListener("clmtrackrLost", clmtrackrLostHandler);
    document.removeEventListener("clmtrackrConverged", clmtrackrConvergedHandler);

    // clmtrackr停止
    ctrack.stop();

    // canvasの描画をクリア
    imageContext.clearRect(0, 0, image.width, image.height);
    wireframeContext.clearRect(0, 0, wireframe.width, wireframe.height);

    // 選択した画像ファイルを取得
    var file = event.target.files[0];

    // 画像ファイルのメタデータを取得
    loadImage.parseMetaData(file, function (data) {
      var options = {
        canvas: true
      };

      // 画像ファイルにExifが設定されていればパラメーターとして設定
      // スマホで画像が回転してしまう挙動の対策
      if (data.exif) {
        options.orientation = data.exif.get("Orientation");
      }

      // 画像の読み込み
      loadImage(
        file,
        function (img) {
          drowLog("画像読み込み成功");

          setTimeout(function () {
            drowLog("顔検出中...");

            // canvasへ描画
            drawImage(img);
          }, 1000);
        }, options);
    });
  }

  /**
   * canvasへ画像を描画
   * @param img
   */
  function drawImage(img) {

    // 画像ファイルのサイズを取得
    var imgW = img.width;
    var imgH = img.height;
    // windowの横幅を取得
    var windowW = inner.clientWidth;
    // windowの横幅と画像の横幅の比率を算出
    var imgRate = windowW / imgW;

    // canvasのサイズを設定
    var imageCanvasWidth = imageCanvas.width = wireframe.width = windowW;
    var imageCanvasHeight = imageCanvas.height = wireframe.height = imgH * imgRate;

    // 画像をcanvasへ描画
    imageContext.drawImage(img, 0, 0, imageCanvasWidth, imageCanvasHeight);

    // マスク用のcanvasを生成
    maskCanvas = document.createElement("canvas");
    maskCanvas.setAttribute("id", "mask");
    maskCanvas.width = imgW;
    maskCanvas.height = imgH;
    // マスク用canvasを配置
    document.getElementById("drawArea").appendChild(maskCanvas);

    // マスクを描画するクラスをインスタンス化
    fd = new faceDeformer();
    // マスクを描画するcanvasを指定
    fd.init(maskCanvas);

    // マスク用画像の読み込み
    var maskImg = document.createElement("img");
    maskImg.onload = function () {
      // マスクの設定
      fd.load(maskImg, maskData, pModel);
    };

    // 繰り返し処理開始
    loop();

    // 顔を検出できたときのEvent
    document.addEventListener("clmtrackrConverged", clmtrackrConvergedHandler);
    // 顔を検出できなかったときのEvent
    document.addEventListener("clmtrackrLost", clmtrackrLostHandler);
    // 顔検出処理をリセット
    ctrack.reset();
    // 顔のモデルデータを設定
    ctrack.init(pModel);
    // 顔の検出を開始
    ctrack.start(imageCanvas);
  }

  /**
   * 顔検出失敗
   */
  function clmtrackrLostHandler() {
    // Remove Event
    document.removeEventListener("clmtrackrLost", clmtrackrLostHandler);
    document.removeEventListener("clmtrackrConverged", clmtrackrConvergedHandler);

    drowLog("顔検出失敗");

    // 繰り返し処理停止
    cancelAnimationFrame(drawRequest);
    // 顔検出処理停止
    ctrack.stop();
  }

  /**
   * 顔検出成功
   */
  function clmtrackrConvergedHandler() {
    // Remove Event
    document.removeEventListener("clmtrackrLost", clmtrackrLostHandler);
    document.removeEventListener("clmtrackrConverged", clmtrackrConvergedHandler);

    drowLog("顔検出成功");

    // 繰り返し処理停止
    cancelAnimationFrame(drawRequest);
  }

  /**
   * ログを表示
   * @param str
   */
  function drowLog(str) {
    log.innerHTML = str;
  }

})();
