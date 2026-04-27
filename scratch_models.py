import urllib.request
import json
import sys

API_KEY = "AIzaSyDK7OcVzFzrsDWFhAfYFN2j1LQfVcNPLg4"
models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-1.0-pro", "gemini-pro", "gemini-pro-vision"]

for model in models:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={API_KEY}"
    data = json.dumps({"contents": [{"parts": [{"text": "Hello"}]}]}).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
    
    try:
        with urllib.request.urlopen(req) as response:
            print(f"{model}: SUCCESS")
    except urllib.error.HTTPError as e:
        print(f"{model}: HTTPError {e.code}")
    except Exception as e:
        print(f"{model}: Error {e}")
