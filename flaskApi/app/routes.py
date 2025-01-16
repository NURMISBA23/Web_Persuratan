from flask import request, jsonify
from functools import wraps
import jwt
import datetime

from app import app

SECRET_KEY = "ini_sangat_rahasia"

def generate_token(username):
    payload = {
        'username': username,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
    return token

# Decorator untuk memverifikasi token JWT
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')

        if not token:
            return jsonify({'message': 'Token is missing!'}), 403

        try:
            # Memverifikasi token
            data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            current_user = data['username']
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired!'}), 403
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token!'}), 403

        return f(current_user, *args, **kwargs)

    return decorated


# Route untuk login dan mendapatkan token
@app.route('/login', methods=['POST'])
def login():
    auth = request.authorization

    if auth and auth.username == 'admin' and auth.password == 'password':
        token = generate_token(auth.username)
        return jsonify({'token': token})

    return jsonify({'message': 'Invalid credentials!'}), 401


# Route yang memerlukan token untuk diakses
@app.route('/protected', methods=['GET'])
@token_required
def protected(current_user):
    return jsonify({'message': f'Hello, {current_user}! This is a protected route.'})
