from http.server import BaseHTTPRequestHandler
import json
import os
import urllib.request

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        # 1. Read the incoming request from the React frontend
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)
        body = json.loads(post_data.decode('utf-8'))
        
        raw_messages = body.get('messages', [])
        
        # 2. Format messages from the React app into the exact structure Gemini requires
        formatted_messages = []
        for msg in raw_messages:
            role = "model" if msg.get("role") == "model" else "user"
            formatted_messages.append({
                "role": role,
                "parts": [{"text": msg.get("content", "")}]
            })
        
        # 3. Get the secure API key from environment variables (from Vercel)
        api_key = os.environ.get('GEMINI_API_KEY')
        
        if not api_key:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"error": "API key not configured"}).encode('utf-8'))
            return
            
        # 4. The Executive Function OS Personality (Option 2: Analytical OS)
        system_instruction = """
        You are the core logic engine for Executive Function OS. Your communication style is crisp, analytical, and highly structured, like a well-designed computer terminal but friendly. When users give you a brain-dump of tasks, your job is to act as their external 'Working Memory'. Categorize their thoughts into: 1. Immediate Actions, 2. Delegated Tasks, and 3. Backlog. Use bolding for key terms and keep your language highly efficient.
        """
        
        payload = {
            "contents": formatted_messages,
            "systemInstruction": { "parts": [{"text": system_instruction}] }
        }
        
        # 5. Make the secure request to Google's Gemini API
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key={api_key}"
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode('utf-8'),
            headers={'Content-Type': 'application/json'}
        )
        
        try:
            with urllib.request.urlopen(req) as response:
                result = json.loads(response.read().decode('utf-8'))
                
                # Extract the text response from Gemini
                ai_text = result.get('candidates', [{}])[0].get('content', {}).get('parts', [{}])[0].get('text', 'No response generated.')
                
                # Send the clean text response back to your React component
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"text": ai_text}).encode('utf-8'))
                
        except Exception as e:
            # Send an error gracefully if something goes wrong
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"error": f"Failed to reach AI engine: {str(e)}"}).encode('utf-8'))


