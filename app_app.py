from flask import Flask, request, jsonify
import random
app = Flask(__name__)

@app.route('/v1', methods=['POST'])
def check_article():

    if not request.is_json:
        response = jsonify({"error": "Request must be JSON"})
        response.status_code = 400
        response.headers["Error-Type"] = "InvalidFormat"
        return response

    data = request.get_json()
    content='content'

    if content not in data:
        response = jsonify({"error": f"Missing {content} field in request body"})
        response.status_code = 400
        response.headers["Error-Type"] = "MissingField"
        return response

    if len(data[content]) < 10:
        response = jsonify({"error": f"{content} field cannot be empty or less than 10 characters"})
        response.status_code = 400
        response.headers["Error-Type"] = "InvalidType"
        return response
    
    confidence  = round(random.uniform(50, 99), 2) 
    is_real     = confidence > 50

    return jsonify({
        "isReal": is_real,
        "confidence": confidence
    }), 200


@app.route('/', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200, 

# if __name__ == '__main__':
#     app.run(debug=True)

# $env:FLASK_APP = "app_app.py"
# $env:FLASK_ENV = "development"
# flask run

# $env:FLASK_ENV = "production"    # $env:FLASK_ENV = "testing"
