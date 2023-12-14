// 関数のインポート
import { getMilliSecond } from './time.js';

// 録画されたデータの格納
var record_data = [];

// カメラの設定
const cameraSetting = {
    audio: false,
    video: {
        width: 1280 / 2,
        height: 720 / 2,
        facingMode: "user",
    }
}

// ウェブカメラのストリームを取得（ウェブカメラのアクセス許可を求める）
const stream = await navigator.mediaDevices.getUserMedia(cameraSetting);

// 'video/webm' 形式のビデオ録画がサポートされているかどうかを確認
if (!MediaRecorder.isTypeSupported('video/webm')) {
    console.warn('video/webm is not supported')
}

// MediaRecorder クラスを使用して、ウェブカメラのストリームを録画するためのメディアレコーダーを作成
const mediaRecorder = new MediaRecorder(stream, {
    mimeType: 'video/webm',
})

const cameraInitSmartphoneSupport = async () => {
    const video = document.getElementById("camera");
    video.srcObject = stream;
}

// 「録画スタート」ボタンを押したときに実行
function cameraRecordStart(){
    mediaRecorder.start();
}

// 「録画ストップ」ボタンを押したときに実行
function cameraRecordStop(){
    mediaRecorder.stop();
}

// 録画データが利用可能になるたびに実行
mediaRecorder.addEventListener('dataavailable', event => {
    record_data.push(event.data);
    // プレビューの用意
    videoRecorded.src = URL.createObjectURL(event.data)
})

// 「ダウンロード」ボタンを押したときに実行
function videoDownload(){
    // 現在時刻をミリ秒で取得
    var nowTime = getMilliSecond();

    console.log("record_data: ");
    console.log(record_data);
    var blob = new Blob(record_data, { type: 'video/mp4' })// 録画ファイルをblob形式に出力
    console.log("get a video by Blob: ");
    console.log(blob);
    var url = window.URL.createObjectURL(blob) // データにアクセスするためのURLを作成
    var a = document.createElement('a') // download属性を持ったaタグをクリックするとダウンロードができるので、それをシミュレートする
    document.body.appendChild(a)
    a.style = 'display:none'
    a.href = url;
    a.download = 'test_' + nowTime + '.mp4'
    a.click()
    window.URL.revokeObjectURL(url)
}

window.cameraInitSmartphoneSupport = cameraInitSmartphoneSupport;
window.cameraRecordStart = cameraRecordStart;
window.cameraRecordStop = cameraRecordStop;
window.videoDownload = videoDownload;
export{ cameraInitSmartphoneSupport, cameraRecordStart, cameraRecordStop, videoDownload };