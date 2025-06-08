from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json

app = Flask(__name__)
CORS(app)  # 全てのリクエストを許可

characters = []  # キャラクターのデータを管理するリスト

@app.route("/add_character", methods=["POST"])
def add_character():
    data = request.json  # フロントエンドから送られたJSONデータを取得
    characters.append(data)  # キャラクターリストに追加
    return jsonify({"message": "キャラクターを追加しました", "characters": characters})  # 更新後のデータを返す

@app.route("/get_characters", methods=["GET"])
def get_characters():
    return jsonify(characters)  # キャラクターリストをJSONで返す

@app.route("/delete_character", methods=["POST"])
def delete_character():
    data = request.json
    name_to_delete = data.get("name")
    global characters
    characters = [char for char in characters if char.get("name") != name_to_delete]
    return jsonify({"message": "キャラクターを削除しました", "characters": characters})

@app.route("/save_characters", methods=["POST"])

def save_characters():
    with open("characters.json", "w", encoding="utf-8") as f:
        json.dump(characters, f, ensure_ascii=False, indent=2)
    return jsonify({"message": "キャラクターをローカルに保存しました"})