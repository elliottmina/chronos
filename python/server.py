#!/usr/bin/env python3
from flask import Flask
import rebuild

app = Flask(__name__, static_url_path='', static_folder='../docroot')
@app.route('/')
def index():
  return rebuild.rebuild()

if __name__ == '__main__':
  app.run(debug=True)

