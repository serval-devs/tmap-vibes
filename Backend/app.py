from flask import Flask, request, jsonify
from flask_cors import CORS
from tf_model_handler import (load_model_and_tokenizer, true_or_fake)
import os

app = Flask(__name__)
CORS(app)

root_dir = os.path.abspath(os.path.dirname(__file__))
model_path = os.path.join(root_dir, "MLModels", "FakeTrueModel.keras")
tokenizer_path = os.path.join(root_dir, "MLModels", "tokenizer.pkl")

model, tokenizer = load_model_and_tokenizer(
    model_path,
    tokenizer_path
)


@app.route('/api/v1/articles', methods=['POST'])
def check_article():
    if not request.is_json:
        response = jsonify({"error": "Request must be JSON"})
        response.status_code = 400
        response.headers["Error-Type"] = "InvalidFormat"
        return response

    data = request.get_json()
    content = 'content'

    if content not in data:
        response = jsonify({"error": f"Missing {content} field"})
        response.status_code = 400
        response.headers["Error-Type"] = "MissingField"
        return response

    if len(data[content]) < 10:
        response = jsonify({"error": "Cannot be empty or less than 10"})
        response.status_code = 400
        response.headers["Error-Type"] = "InvalidType"
        return response

    confidence_raw = true_or_fake(model, tokenizer, [data[content]])[0][0]
    confidence = round(confidence_raw.item() * 100, 2)

    return jsonify({
        "isReal": confidence > 50,
        "confidence": confidence
    }), 200


@app.route('/', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200
