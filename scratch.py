import urllib.request
import json
import sys

API_KEY = "AIzaSyDK7OcVzFzrsDWFhAfYFN2j1LQfVcNPLg4"
url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={API_KEY}"
data = json.dumps({"contents": [{"parts": [{"text": "Explain how AI works"}]}]}).encode('utf-8')
req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})

try:
    with urllib.request.urlopen(req) as response:
        print(response.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print(f"HTTPError: {e.code} {e.reason}")
    print(e.read().decode('utf-8'))
except Exception as e:
    print(f"Error: {e}")
