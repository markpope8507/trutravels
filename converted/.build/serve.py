"""Static preview server for converted/.

`python3 -m http.server` sends no Cache-Control, so Chrome heuristically caches
styles.css and serves a stale copy after every edit — pages then render with
half-applied CSS. This sends no-store so a reload always shows the current file.

    python3 .build/serve.py [port]     # run from converted/
"""
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def log_message(self, fmt, *args):
        pass


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
    print(f"serving converted/ on http://localhost:{port} (no-store)")
    ThreadingHTTPServer(("", port), NoCacheHandler).serve_forever()
