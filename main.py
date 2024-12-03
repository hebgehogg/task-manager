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

tasks = [
    {
        'id': 1,
        'user': {
            'name': 'Alina',
            'email': 'test@gmail.com'
        },
        'description': 'alina_test description',
        'status': 'open'
    },
    {
        'id': 2,
        'user': {
            'name': 'Lera',
            'email': 'lera_test@gmail.com'
        },
        'description': 'test description v2',
        'status': 'open'
    },
    {
        'id': 3,
        'user': {
            'name': 'Katya',
            'email': 'katya_test@gmail.com'
        },
        'description': 'test description v3',
        'status': 'done'
    },
    {
        'id': 4,
        'user': {
            'name': 'Roma',
            'email': 'roma_test@gmail.com'
        },
        'description': 'test description v4',
        'status': 'in progress'
    }
]


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


@app.route('/task_manager/api/get_tasks', methods=['GET'])
def get_tasks():
    return jsonify(tasks), 200


@app.route('/task_manager/api/update_task', methods=['PUT'])
def update_task():
    data = request.get_json(silent=True)
    task_key = data.get('task_key')
    updated_fields = data.get('updated_fields')

    if not task_key or not updated_fields:
        return jsonify({"error": "Invalid request"}), 400

    task = next((task for task in tasks if task['id'] == task_key), None)

    if not task:
        return jsonify({"error": "Task not found"}), 404

    def update_recursive(target, updates):
        """
        Рекурсивно обновляет объект `target` данными из `updates`.
        """
        for key, value in updates.items():
            if isinstance(value, dict) and key in target and isinstance(target[key], dict):
                update_recursive(target[key], value)
            else:
                target[key] = value

    try:
        update_recursive(task, updated_fields)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return jsonify({"success": True, "task": task}), 200


if __name__ == '__main__':
    app.run()
