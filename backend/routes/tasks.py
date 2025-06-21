from flask import Blueprint, request, jsonify
from bson import ObjectId
from db import tasks_collection
from utils.auth import token_required
import datetime

tasks_bp = Blueprint("tasks", __name__)

@tasks_bp.route("", methods=["GET"])
@token_required
def get_tasks(current_user_id):
    # Optional: filter by status query param ?status=todo|inprogress|completed
    status = request.args.get("status")
    query = {"user_id": current_user_id}
    if status:
        query["status"] = status
    tasks = list(tasks_collection.find(query))
    for task in tasks:
        task["_id"] = str(task["_id"])
    return jsonify(tasks), 200

@tasks_bp.route("/upcoming", methods=["GET"])
@token_required
def get_upcoming_tasks(current_user_id):
    now = datetime.datetime.utcnow()
    tasks = list(tasks_collection.find({
        "user_id": current_user_id,
        "dueDate": {"$gte": now},
        "status": {"$ne": "completed"}
    }))
    for task in tasks:
        task["_id"] = str(task["_id"])
    return jsonify(tasks), 200

@tasks_bp.route("", methods=["POST"])
@token_required
def add_task(current_user_id):
    data = request.get_json()
    data["user_id"] = current_user_id
    result = tasks_collection.insert_one(data)
    return jsonify({"message": "Task added", "task_id": str(result.inserted_id)}), 201

@tasks_bp.route("/<task_id>", methods=["PUT"])
@token_required
def update_task(current_user_id, task_id):
    data = request.get_json()
    query = {"_id": ObjectId(task_id), "user_id": current_user_id}
    updated = tasks_collection.update_one(query, {"$set": data})
    if updated.matched_count == 0:
        return jsonify({"message": "Task not found"}), 404
    return jsonify({"message": "Task updated"}), 200

@tasks_bp.route("/<task_id>", methods=["DELETE"])
@token_required
def delete_task(current_user_id, task_id):
    query = {"_id": ObjectId(task_id), "user_id": current_user_id}
    deleted = tasks_collection.delete_one(query)
    if deleted.deleted_count == 0:
        return jsonify({"message": "Task not found"}), 404
    return jsonify({"message": "Task deleted"}), 200
