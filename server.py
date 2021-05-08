#!/usr/bin/env python

import http.server
import socketserver
import logging
import sqlite3

db_file = "answers.db"
db = sqlite3.connect(db_file)
c = db.cursor()
c.execute("""
    create table if not exists answers (
        ctime timestamp not null default current_timestamp,
        key text not null,
        data text not null)
""")

c.close()
db.close()

db = sqlite3.connect(db_file)


class RequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        self.path = "dist" + self.path
        return http.server.SimpleHTTPRequestHandler.do_GET(self)

    def do_POST(self):
        cookie = self.headers.get("Cookie")
        content_length = int(self.headers["Content-Length"])
        data = self.rfile.read(content_length).decode("utf-8")
        logging.info("POST %s\nHeaders:\n%s", str(self.path), str(self.headers))

        db.cursor().execute(
            "insert into answers (key, data) values (?, ?)",
            (cookie, data))
        db.commit()

        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.end_headers()
        self.wfile.write("{}".encode("utf-8"))



server = socketserver.TCPServer(("", 1234), RequestHandler)
server.serve_forever()
