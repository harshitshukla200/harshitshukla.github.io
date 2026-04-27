import urllib.request
import json

API_KEY = "AIzaSyDK7OcVzFzrsDWFhAfYFN2j1LQfVcNPLg4"
url = f"https://generativelanguage.googleapis.com/v1beta/models?key={API_KEY}"

try:
    with urllib.request.urlopen(url) as response:
        models = json.loads(response.read().decode('utf-8'))['models']
        for model in models:
            if 'generateContent' in model.get('supportedGenerationMethods', []):
                print(model['name'])
except Exception as e:
    print(f"Error: {e}")
