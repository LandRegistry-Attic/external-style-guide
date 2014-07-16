from flask import Flask, render_template
 
app = Flask(__name__)      

# govuk_template asset path
@app.context_processor
def asset_path_context_processor():
    return {'asset_path': '/static/development/govuk_template/'}

 
@app.route('/')
def home():
  return render_template('style-guide/index.html')
 
if __name__ == '__main__':
  app.run(debug=True)