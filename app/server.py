from flask import Flask, render_template
from flask.ext.assets import Environment

import argparse
import os

app = Flask(__name__)
app.debug = True

# handle command line arguments
parser = argparse.ArgumentParser()
parser.add_argument('-t', '--testbuild', action='store_true')
args = parser.parse_args()

app.config['TESTBUILD'] = args.testbuild

# govuk_template asset path
@app.context_processor
def asset_path_context_processor():
  if app.config['TESTBUILD'] == True:
  	return {
      'asset_path': '/static/build/',
      'landregistry_asset_path': '/static/build/',
      'env_flag': 'Using BUILD'
    }
  else:
    return {
      'asset_path': '/static/development/govuk-template/',
      'landregistry_asset_path': '/static/development/',
      'env_flag': 'Using DEV'
    }

@app.route('/')
def home():
  return render_template('style-guide/index.html')

#  Some useful headers to set to beef up the robustness of the app
# https://www.owasp.org/index.php/List_of_useful_HTTP_headers
@app.after_request
def after_request(response):
  response.headers.add('Content-Security-Policy', "default-src 'self'; font-src 'self' data:; image-src 'self' data:; script-src 'self' 'unsafe-inline'")
  response.headers.add('X-Frame-Options', 'deny')
  response.headers.add('X-Content-Type-Options', 'nosniff')
  response.headers.add('X-XSS-Protection', '1; mode=block')
  return response

if __name__ == '__main__':
  app.run(host='0.0.0.0')
