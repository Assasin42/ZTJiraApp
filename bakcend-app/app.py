from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient

# MongoDB bağlantısı
app = Flask(__name__)
CORS(app)  # CORS hatasını engeller
icerik = ""
with open("credentials.txt", "r", encoding="utf-8") as f:
    icerik = f.read()

uri = icerik
client = MongoClient(uri)
db = client["form_veritabani"]  # ← eksik olan satır bu!
collection = db["formlar"]

@app.route("/")
def home():
    return "API çalışıyor! 👋"

@app.route('/api/card', methods=['POST'])
def deneme():
    data = request.get_json()

    # son kaydı id alanına göre bul (descending)
    last_doc = collection.find_one(sort=[("_id", -1)])
    new_id = (last_doc["_id"] + 1) if last_doc and "_id" in last_doc else 1

    # yeni kart
    new_card = {
        "_id": new_id,  # frontend için kullanılacak
        "type": data.get("type"),
        "projectName": data.get("projectName"),
        "projectGoal": data.get("projectGoal"),
        "taskType": data.get("taskType"),
        "tags": data.get("tags", []),
        "status": data.get("status", 0)
    }

    # Mongo'ya ekle (otomatik `_id` de olacak)
    result = collection.insert_one(new_card)

    # response’a hem id hem _id gönderelim

    return jsonify(new_card), 201

@app.route('/api/card/<int:card_id>', methods=['PUT'])
def update_card(card_id):
    data = request.get_json()
    result = collection.update_one({"_id": card_id}, {"$set": data})
    if result.matched_count == 0:
        return jsonify({"error": "Kart bulunamadı"}), 404
    return jsonify({"mesaj": "Kart güncellendi"}), 200

@app.route('/api/fixcard/<int:card_id>', methods=['PUT'])
def fix_card(card_id):
    data = request.get_json()
    result = collection.update_one({"_id": card_id}, {"$set": data})
    if result.matched_count == 0:
        return jsonify({"error": "Kart bulunamadı"}), 404
    return jsonify({"mesaj": "Kart güncellendi"}), 200

@app.route("/api/cart/<int:kart_id>", methods=["DELETE"])
def delete_kart(kart_id):
    result = collection.delete_one({"_id": kart_id})
    if result.deleted_count > 0:
        return jsonify({"message": "Kart silindi"}), 200
    else:
        return jsonify({"error": "Kart bulunamadı"}), 404

@app.route('/api/card', methods=['GET'])
def Cards():
    # MongoDB'den kayıtları çekmek
    result = list(collection.find({"status": {"$in": [0, 1, 2, 3, 4]},"type":"görev"}))
    
    return jsonify(result), 200

    
@app.route('/api/backlogcards', methods=['GET'])
def backlogCards():
    
    # MongoDB'den kayıtları çekmek
    result = list(collection.find({"status": {"$in": [0]},"type":"görev"}))
    
    return jsonify(result), 200


@app.route('/api/todoCards', methods=['GET'])
def todoCards():
    
    # MongoDB'den kayıtları çekmek
    result = list(collection.find({"status": {"$in": [1]},"type":"görev"}))
    
    return jsonify(result), 200

@app.route('/api/InprocessCards', methods=['GET'])
def InprocessCards():
    
    # MongoDB'den kayıtları çekmek
    result = list(collection.find({"status": {"$in": [2]},"type":"görev"}))
    
    return jsonify(result), 200
@app.route('/api/InreviewCards', methods=['GET'])
def InreviewCards():
    
    # MongoDB'den kayıtları çekmek
    result = list(collection.find({"status": {"$in": [3]},"type":"görev"}))
    
    return jsonify(result), 200
@app.route('/api/DoneCards', methods=['GET'])
def DoneCards():
    
    # MongoDB'den kayıtları çekmek
    result = list(collection.find({"status": {"$in": [4]},"type":"görev"}))
    
    return jsonify(result), 200

@app.route('/api/projects', methods=['GET'])
def projects():
    
    # MongoDB'den kayıtları çekmek
    result = list(collection.find({"type":"proje"}))
    
    return jsonify(result), 200

@app.route('/api/projects/<int:project_id>', methods=['PUT'])
def update_project(project_id):
    data = request.get_json()
    result = collection.update_one({"_id": project_id}, {"$set": data})
    if result.matched_count == 0:
        return jsonify({"error": "Kart bulunamadı"}), 404
    return jsonify({"mesaj": "Kart güncellendi"}), 200


if __name__ == '__main__':
    app.run(port=3001, debug=True)