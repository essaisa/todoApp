# db.py
from pymongo import MongoClient
import os
from dotenv import load_dotenv
# revise
import certifi

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(MONGO_URI, tlsCAFile=certifi.where())  # Use certifi's CA certs
db = client["todo_app"]

users_collection = db["users"]
tasks_collection = db["tasks"]
