import os
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

class CustomHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

if __name__ == '__main__':
    web_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(web_dir)
    server = ThreadingHTTPServer(('127.0.0.1', 5500), CustomHandler)
    print(f'Mid-Autumn 3D Server running at http://127.0.0.1:5500/')
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
