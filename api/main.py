from flask import Flask, jsonify, request
import os
import json
from googleapiclient.discovery import build
from google.oauth2.service_account import Credentials
from collections import OrderedDict

app = Flask(__name__)

# Environment variables
DOCUMENT_ID = os.getenv("DOCUMENT_ID")
SERVICE_ACCOUNT_FILE = os.getenv("SERVICE_ACCOUNT_FILE")
OUTPUT_FILE = "/tmp/output.json"  # Use /tmp in GCP since it's writable

@app.route("/", methods=["GET", "OPTIONS"])
def fetch_and_convert(request):
    """Fetches content from Google Docs, validates JSON, and returns it."""
    if request.method == "OPTIONS":
        # Handle preflight requests for CORS
        headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET",
            "Access-Control-Allow-Headers": "Content-Type",
        }
        return ("", 204, headers)

    try:
        # Fetch content from Google Docs
        content = fetch_google_docs_content()

        # Validate and parse JSON
        json_data = validate_json_format(content)

        # Optionally save to a file (for debugging purposes)
        save_json_to_file(json_data, OUTPUT_FILE)

        # Convert OrderedDict to JSON string while keeping order
        response_json = json.dumps(json_data, ensure_ascii=False, indent=4)

        # Return JSON data as a response with CORS headers
        headers = {"Access-Control-Allow-Origin": "*"}
        return (response_json, 200, headers)
    except Exception as e:
        headers = {"Access-Control-Allow-Origin": "*"}
        return (jsonify({"error": str(e)}), 500, headers)

def fetch_google_docs_content():
    """Fetches content from a Google Docs file."""
    SCOPES = ['https://www.googleapis.com/auth/documents.readonly']
    credentials = Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES
    )
    service = build('docs', 'v1', credentials=credentials)

    document = service.documents().get(documentId=DOCUMENT_ID).execute()
    content = []
    for element in document.get('body', {}).get('content', []):
        if 'paragraph' in element:
            for text_run in element['paragraph']['elements']:
                if 'textRun' in text_run and 'content' in text_run['textRun']:
                    text_content = text_run['textRun']['content']
                    content.append(text_content.strip())
    return "\n".join(content)

def validate_json_format(json_string):
    """Validates if the provided string is a valid JSON array of objects."""
    try:
        data = json.loads(json_string, object_pairs_hook=OrderedDict)  
        if isinstance(data, list) and all(isinstance(item, OrderedDict) for item in data):
            return data
        else:
            raise ValueError("JSON data is not an array of objects.")
    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid JSON format: {e}")

def save_json_to_file(data, output_file):
    """Saves JSON data to a file."""
    with open(output_file, "w", encoding="utf-8") as file:
        json.dump(data, file, ensure_ascii=False, indent=4)
    print(f"JSON data saved to {output_file}")

if __name__ == "__main__":
    app.run(debug=True)
