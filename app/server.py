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
      'env_flag': 'build'
    }
  else:
    return {
      'asset_path': '/static/development/govuk-template/',
      'landregistry_asset_path': '/static/development/',
      'env_flag': 'development'
    }

@app.route('/')
def home():
  return render_template('style-guide/index.html')

@app.route('/typography')
def typography():
  return render_template('style-guide/typography.html')

@app.route('/data-visualisation')
def data_visualisation():
  return render_template('style-guide/data-visualisation.html')

@app.route('/forms')
def forms():
  return render_template('style-guide/forms.html')

@app.route('/modules')
def modules():
  return render_template('style-guide/modules.html')

@app.route('/todo')
def todo():
  return render_template('style-guide/todo.html')

#  Some useful headers to set to beef up the robustness of the app
# https://www.owasp.org/index.php/List_of_useful_HTTP_headers
@app.after_request
def after_request(response):
  response.headers.add('Content-Security-Policy', "default-src 'self'; font-src 'self' data:; style-src 'self' 'unsafe-inline'; img-src http://placehold.it 'self' data:; script-src 'self' 'unsafe-inline'")
  response.headers.add('X-Frame-Options', 'deny')
  response.headers.add('X-Content-Type-Options', 'nosniff')
  response.headers.add('X-XSS-Protection', '1; mode=block')
  return response

if __name__ == '__main__':
  # Bind to PORT if defined, otherwise default to 5000.
  port = int(os.environ.get('PORT', 5000))
  app.run(host='0.0.0.0', port=port)

