import logging

from flask import Flask, request, jsonify
from flask_cors import CORS

logging.basicConfig(
    level=logging.INFO,
    format="[%(levelname)s] - %(name)s - %(funcName)s(%(lineno)d) - %(message)s",
)
logger = logging.getLogger(__name__)
app = Flask(__name__)
CORS(app)


# todo check token
@app.route('/task_manager/api/login', methods=['POST'])
def login():
    data = request.get_json(silent=True)
    username = data.get('username')
    password = data.get('password')

    if username == 'admin' and password == '123':
        return jsonify({"success": True, "message": "Login successful", "token": "example-token"}), 200
    else:
        return jsonify({"success": False, "message": "Invalid credentials"}), 401


if __name__ == '__main__':
    app.run()
