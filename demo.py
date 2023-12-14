import cv2
import numpy as np
import random

# 機械学習モデルのデモ関数
def demo_detect(input_cap):
    # 引数のVideoCaptureオブジェクトを変数capに格納
    cap = input_cap

    # -1, 0, 1 のうち１つをランダムに返す
    return random.choice([-1, 0, 1])