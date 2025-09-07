import os
import json
from collections import OrderedDict

import functions_framework
from flask import jsonify, make_response, request
from googleapiclient.discovery import build
import google.auth
from google.oauth2 import id_token
from google.auth.transport import requests as grequests

DOCUMENT_ID = os.getenv("DOCUMENT_ID", "").strip()
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "").strip()

ALLOWED_ORIGINS = {
    o.strip().rstrip("/")  # normalize trailing slash
    for o in os.getenv("ALLOWED_ORIGINS", "").split(",")
    if o.strip()
}

ALLOWED_EMAILS = {
    e.strip().lower()
    for e in os.getenv("ALLOWED_EMAILS", "").split(",")
    if e.strip()
}

def _pick_cors_origin(req_origin: str | None) -> str | None:
    """Return the allowed origin to echo back, or None for disallowed/no origin."""
    if not req_origin:
        return None
    norm = req_origin.rstrip("/")
    if ALLOWED_ORIGINS:
        return norm if norm in ALLOWED_ORIGINS else None
    return "*"

def cors_response(body, status=200, req_origin: str | None = None):
    """Attach CORS headers based on request Origin and allowlist."""
    resp = make_response(body, status)
    origin_to_send = _pick_cors_origin(req_origin)

    if origin_to_send:
        resp.headers["Access-Control-Allow-Origin"] = origin_to_send

    resp.headers["Access-Control-Allow-Methods"] = "GET, OPTIONS"
    resp.headers["Access-Control-Allow-Headers"] = "Authorization, Content-Type"
    resp.headers["Vary"] = "Origin"
    resp.headers["Content-Type"] = resp.headers.get("Content-Type", "application/json; charset=utf-8")
    return resp

def verify_id_token(authorization_header: str | None):
    """Verify Google ID token from 'Authorization: Bearer <token>' header."""
    if not authorization_header or not authorization_header.startswith("Bearer "):
        return (False, "Missing or invalid Authorization header")

    token = authorization_header.split(" ", 1)[1]
    try:
        info = id_token.verify_oauth2_token(
            token, grequests.Request(), GOOGLE_CLIENT_ID
        )
        if not info.get("email_verified"):
            return (False, "Email not verified")
        email = (info.get("email") or "").lower()
        if ALLOWED_EMAILS and email not in ALLOWED_EMAILS:
            return (False, "Not authorized")
        return (True, info)
    except Exception as e:
        return (False, f"Token verification failed: {e}")

def fetch_google_docs_content():
    """Fetch plain text from a Google Doc using Application Default Credentials."""
    if not DOCUMENT_ID:
        raise RuntimeError("DOCUMENT_ID is not set")

    SCOPES = ["https://www.googleapis.com/auth/documents.readonly"]
    creds, _ = google.auth.default(scopes=SCOPES)  
    service = build("docs", "v1", credentials=creds)

    document = service.documents().get(documentId=DOCUMENT_ID).execute()
    content = []
    for element in document.get("body", {}).get("content", []):
        if "paragraph" in element:
            for el in element["paragraph"]["elements"]:
                text_run = el.get("textRun", {})
                if "content" in text_run:
                    piece = text_run["content"].strip()
                    if piece:
                        content.append(piece)
    return "\n".join(content)

def validate_json_format(json_string):
    """Ensure the doc contains a JSON array of objects (order-preserving)."""
    data = json.loads(json_string, object_pairs_hook=OrderedDict)
    if isinstance(data, list) and all(isinstance(item, OrderedDict) for item in data):
        return data
    raise ValueError("JSON data is not an array of objects.")

@functions_framework.http
def fetch_and_convert(request):
    req_origin = request.headers.get("Origin")

    # Preflight
    if request.method == "OPTIONS":
        return cors_response("", 204, req_origin=req_origin)

    # AuthN/AuthZ
    ok, info = verify_id_token(request.headers.get("Authorization"))
    if not ok:
        status = 401 if "Token" in str(info) or "Authorization header" in str(info) else 403
        return cors_response(jsonify({"error": str(info)}), status, req_origin=req_origin)

    try:
        raw = fetch_google_docs_content()
        data = validate_json_format(raw)
        body = json.dumps(data, ensure_ascii=False)
        return cors_response(body, 200, req_origin=req_origin)
    except Exception as e:
        print(f"[ERROR] fetch_and_convert failed: {e}")
        return cors_response(jsonify({"error": str(e)}), 500, req_origin=req_origin)
