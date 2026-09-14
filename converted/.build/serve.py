"""Static preview server for converted/.

Two things `python3 -m http.server` gets wrong for this build:

  · it sends no Cache-Control, so Chrome heuristically caches styles.css and
    serves a stale copy after every edit — pages then render with half-applied
    CSS. This sends no-store so a reload always shows the current file.
  · a missing path returns its own plain-text 404 rather than the site's
    404.html, so the designed page never shows. This serves 404.html.

    python3 .build/serve.py [port]     # run from converted/
"""

import os
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

NOT_FOUND_PAGE = "404.html"


class PreviewHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def send_error(self, code, message=None, explain=None):
        """Serve the site's own 404 page, still under a 404 status."""
        if code == 404 and os.path.exists(NOT_FOUND_PAGE):
            try:
                body = open(NOT_FOUND_PAGE, "rb").read()
            except OSError:
                return super().send_error(code, message, explain)
            self.send_response(404)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            if self.command != "HEAD":
                self.wfile.write(body)
            return
        super().send_error(code, message, explain)

    def log_message(self, fmt, *args):
        pass


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
    print(f"serving converted/ on http://localhost:{port} (no-store, 404.html)")
    ThreadingHTTPServer(("", port), PreviewHandler).serve_forever()
