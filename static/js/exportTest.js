// 関数のインポート
import { getMilliSecond } from './time.js';

// 録画されたデータの格納
var record_data = [];

// カメラの設定
const cameraSetting = {
    audio: false,
    video: {
        width: 1280,
        height: 720,
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
    // 録画の開始
    mediaRecorder.start();
    console.log('録画が開始されました');

    // 1秒待機
    await wait(1000);

    // 録画の停止
    mediaRecorder.stop();
    console.log('録画を停止しました');

    // mediaRecorder.stop()の完了を待つ
    await new Promise(resolve => {
        mediaRecorder.onstop = resolve;
    });

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

// 動画データをPythonに送信する
function sendBlobToServer(blobFile){
    // 動画データ(Blob)をHTTPリクエスト(XHR)を介してPython()に送信する
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/upload', true);

    xhr.onload = () => {
        if (xhr.status === 200) {
            // 200が返ってくると、正常に送信されたことが分かる
            console.log('BlobデータをPythonに送信しました');
            // httpレスポンスを取得
            var responce = xhr.responseText;
            console.log("get a http responce from Python: " + responce);

            // httpレスポンスを加工・表示
            responceToHtml(responce);

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

// httpレスポンスを受け取ってHTMLに表示させる
function responceToHtml(responceInput){
    // HTMLに入れる要素
    var message = "カンニングは検知されていません";
    var subMessage = "この調子で試験がんばってください！";

    switch(responceInput){
        case '1':
            message = "カンニングが検知されました";
            subMessage = "試験監督者の指示に従ってください！";
            break;
        case '-1':
            message = "エラーが起きました";
            subMessage = "このまま試験を続行してください";
            break;
    }

    // 表示
    let messageArea = document.getElementById("messageArea");
    let subMessageArea = document.getElementById("subMessageArea");
    messageArea.innerHTML = message;
    subMessageArea.innerHTML = subMessage;

}
  


// 関数のエクスポート
window.vStart = vStart;
export{ vStart }