from flask import Flask, request, jsonify
import random
app = Flask(__name__)


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

    confidence = round(random.uniform(50, 99), 2)
    is_real = confidence > 50

    return jsonify({
        "isReal": is_real,
        "confidence": confidence
    }), 200


@app.route('/', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200
