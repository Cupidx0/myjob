import os
from functools import wraps
from flask import Flask, jsonify, request, abort
import firebase_admin
from firebase_admin import credentials, firestore
from firebase_admin import initialize_app
from firebase_admin import db   
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
API_KEY = os.environ["JOB_SWIPR_KEY"]

def require_key(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        if request.headers.get("X-API-Key") != API_KEY:
            abort(401)
        return f(*args, **kwargs)
    return wrapper

@app.get("/api/jobs")
@require_key
def list_jobs():
    docs = db.collection("jobs").limit(50).stream()
    print(f"list_jobs called{len(list(docs))} jobs found")
    return jsonify([{"id": d.id, **d.to_dict()} for d in docs])
@app.post("/api/jobs/<jobId>/save")
@require_key
def save_job(jobId):
    db.collection("appliedJobs").document(jobId).set({"saved": True})
    print(f"save_job called for job_id: {jobId}")
    return jsonify({"ok": True}), 201
g = "test"
print(f"Starting Flask app on port 5001...{g}")
if __name__ == "__main__":
    app.run(port=5001, debug=True)