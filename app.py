from flask import Flask, request, render_template
import cv2
import numpy as np
import tempfile     # 一時ファイルを一時ディレクトリに保存するためのライブラリ
import demo         # カンニング検知の機械学習モデル（デモ）関数を呼び出す
import detect       # カンニング検知の機械学習モデル（本物）関数を呼び出す

app = Flask(__name__)

# タイムアウトの設定（秒単位）
app.config['TIMEOUT'] = 180

@app.route("/")
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_blob():
    # httpリクエストからファイルを取得する
    uploaded_blob = request.files['file']
    
    if uploaded_blob:
        # Blob(FileStorage)データをBytesデータに変える
        data = uploaded_blob.read()

        # NumPy配列に変換する
        data_nArray = np.frombuffer(data, np.uint8)

        # 一時ファイルを作成してblobデータを保存
        with tempfile.NamedTemporaryFile(delete=False) as temp_file:
            temp_file.write(data_nArray.tobytes())

        # 一時ファイルのパスを取得
        temp_file_path = temp_file.name

        # VideoCaptureオブジェクトを作成
        cap = cv2.VideoCapture(temp_file_path)

        # 機械学習モデル（デモ）にVideoCaptureオブジェクトを渡す
        output = demo.demo_detect(cap) # デモ
        # output = detect.detect(cap)

        frame = demo.get_frame(cap)
        print("[ GET ] a video frame rate from VideoCapture Object is:")
        print(frame)

        # 念のためVideoCaptureオブジェクトを解放
        cap.release()

        # 機械学習モデルの関数の返り値をhttpレスポンスに流す
        return str(output)
    else:
        return 'Blobデータが送信されていません', 400

# 任意のURLのルーティング
@app.route("/<url>")
def link(url):
    return render_template(f'{ url }')