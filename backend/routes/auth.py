from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
import os
from db import users_collection
from dotenv import load_dotenv

load_dotenv()

auth_bp = Blueprint("auth", __name__)


@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if users_collection.find_one({ "username": username }):
        return jsonify({ "message": "Username already exists" }), 409

    hashed_pw = generate_password_hash(password)
    users_collection.insert_one({
        "username": username,
        "password": hashed_pw
    })

    return jsonify({ "message": "User created successfully" }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = users_collection.find_one({ "username": username })

    if not user or not check_password_hash(user['password'], password):
        return jsonify({ "message": "Invalid credentials" }), 401

    token = jwt.encode({
        "user_id": str(user["_id"]),
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }, os.getenv("SECRET_KEY"), algorithm="HS256")

    return jsonify({ "token": token }), 200
