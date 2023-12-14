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

// 「はじめる」ボタンを押したときに実行
async function vStart(){
    // 現在時刻をミリ秒で取得
    var nowTime = getMilliSecond();

    // 録画の開始
    mediaRecorder.start();
    console.log('録画が開始されました');

    // 11秒後（10秒分あればよいが念のため11秒）
    await wait(11000);

    // 録画の停止
    mediaRecorder.stop();
    console.log('録画を停止しました');

    // 録画ファイルをblob形式に出力
    var blob = new Blob(record_data, { type: 'video/webm' })
    console.log("send blob data: ");
    console.log(blob);

    // recordedBlobをHTTPリクエストを介してPythonに送信する
    sendBlobToServer(blob);
}

// 録画データが利用可能になるたびに実行
mediaRecorder.addEventListener('dataavailable', event => {
    record_data.push(event.data);
})

// blob形式のファイルをHTTPリクエストを介してPythonに送信する
function sendBlobToServer(blobFile){
    // blobFileをHTTPリクエスト(Ajax)を介してPythonに送信する
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/upload', true);

    xhr.onload = function() {
    if (xhr.status === 200) {
        console.log('BlobデータをPythonに送信しました');
    } else {
        console.error('HTTPリクエストエラー:', xhr.status);
    }
    };

    const formData = new FormData();
    formData.append('file', blobFile, 'recorded_video.webm');

    xhr.send(formData);
}

// スリープ関数
function wait(mSec) {
    // jQueryのDeferredを作成します。
    var objDef = new $.Deferred;
    setTimeout(() => {
        // 引数ミリ秒後に、resolve()を実行し、Promiseを完了。
        objDef.resolve(mSec);
    }, mSec);
    return objDef.promise();
};
  


// 関数のエクスポート
window.vStart = vStart;
export{ vStart }