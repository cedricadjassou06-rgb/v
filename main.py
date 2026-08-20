import json
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class SiteHandler(SimpleHTTPRequestHandler):
	def do_POST(self):
		if self.path != "/contact":
			self.send_error(404, "Route introuvable")
			return

		try:
			content_length = int(self.headers.get("Content-Length", 0))
			data = json.loads(self.rfile.read(content_length))
			name = str(data.get("name", "")).strip()
			email = str(data.get("email", "")).strip()
			message = str(data.get("message", "")).strip()
		except (ValueError, json.JSONDecodeError):
			self.send_json({"success": False, "message": "Donnees invalides."}, 400)
			return

		if not name or not email or not message:
			self.send_json({"success": False, "message": "Tous les champs sont obligatoires."}, 400)
			return

		print(f"Nouveau message de {name} ({email}): {message}")
		self.send_json({"success": True, "message": "Message recu, merci !"})

	def send_json(self, payload, status=200):
		response = json.dumps(payload).encode("utf-8")
		self.send_response(status)
		self.send_header("Content-Type", "application/json; charset=utf-8")
		self.send_header("Content-Length", str(len(response)))
		self.end_headers()
		self.wfile.write(response)


if __name__ == "__main__":
	server = ThreadingHTTPServer(("127.0.0.1", 8000), SiteHandler)
	print("Site disponible sur http://127.0.0.1:8000/st.html")
	try:
		server.serve_forever()
	except KeyboardInterrupt:
		print("\nServeur arrete.")
		server.server_close()
