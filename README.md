style-guide
===========

Canonical source of markup patterns and css for Land Registry applications.

The style-guide is a [Flask](http://flask.pocoo.org/) application, with [Grunt](http://gruntjs.com/) workflow to generate assets.

It includes:

* [GOVUK frontend toolkit](https://github.com/alphagov/govuk_frontend_toolkit) (as a [node package](https://www.npmjs.org/package/govuk_frontend_toolkit))
* [GOVUK template](https://github.com/alphagov/govuk_template)
* [GOVUK elements](https://github.com/alphagov/govuk_elements)


## Requirements

### [Node](http://nodejs.org/)

You may already have it, try:

```
node --version
```

Your version needs to be at least v0.10.0.

### [Grunt](http://gruntjs.com)

Make sure you've installed the Grunt command line interface --- see http://gruntjs.com/getting-started

### The [Sass](http://sass-lang.com/) ruby gem

You probably already have Ruby installed, try

```
ruby -v
```

When you've confirmed you have Ruby installed, run ```gem install sass``` to install Sass.

### A Python virtual environment

1. install [virtualenv](https://virtualenv.pypa.io/en/latest)

2. install [virtualenvwrapper](http://virtualenvwrapper.readthedocs.org/en/latest/)

Note very important the part in virtualenvwrapper install intructions about sourcing the virtualenvwrapper.sh in your .bash_profile.

On my machine I have the following in my .bash_profile

```
export WORKON_HOME=~/.virtualenvs
source /usr/local/bin/virtualenvwrapper.sh
```

So when I call ```mkvirtualenv some-name``` I get a some-name virtual environment directory in ~/.virtualenvs

Now create a virtualenv for the style-guide project

```
mkvirtualenv style-guide
```

This automatically activates the virtualenv. Once done any pip installs will install into that virtualenv.

Anytime you want to activate the virtualenv from that point on, you just enter

```
workon style-guide
```


## Getting started

Once you've got the requirements in place, get the style guide in place:

* Clone this repo.
* Ensure you’ve cd’ed into the style-guide folder, then ```npm install``` to install dependencies.
* Activate your virtual environment: ```workon style-guide```
* Install Python requirements: ```pip install -r requirements.txt```

## Running the application

* To run the server and have sass files watched: ```grunt```
* To build minified and concatenated production assets: ```grunt build```

When running the app with ```grunt``` you will be linked to development assets (i.e. non-minified). This will be shown in the footer of the style guide:

![Footer message showing development assets](https://github.com/LandRegistry/style-guide/blob/gh-pages/readme-images/using-dev-assets.png)

You will want to *test* your build files before you submit a pull request!

Run ```app/server.py --testbuild``` (or with ```-t```) - this will run the server using the productions assets from /app/static/build/ _instead_ of our development assets. Check the footer of the style guide, it should say "Currently using *build* assets".

![Footer message showing build assets](https://github.com/LandRegistry/style-guide/blob/gh-pages/readme-images/using-build-assets.png)


## Using the base templates and assets in Land Registry Flask projects

The master zip of the project contains all the built files and templates needed.

[Download](https://github.com/LandRegistry/style-guide/archive/master.zip) and upack the the zip file.

Copy the build directory from app/static/ into your application’s static directory so that you have

```
yourapp/static/build
```

Copy the global directory from app/templates to your templates directory so that you have:

```
yourapp/templates/global
```

Create a base template in the root of your templates directory that looks like this:

```
{% extends "global/landregistry_base.html" %}

{% block header_class %}with-proposition{% endblock %}
{% block proposition_header %}
  <div class="header-proposition">
    <div class="content">
      <a href="/" id="proposition-name">Land registry</a>
    </div>
  </div>
{% endblock %}
```

If for example your base template above is called someapp_base.html, then the
application templates can just inherit from this one, e.g.

```
{% extends "someapp_base.html" %}
.
.
.

```

Add the following to your application (probably in the __init__.py):

```
@app.context_processor
def asset_path_context_processor():
    return {
      'asset_path': '/static/build/',
      'landregistry_asset_path': '/static/build/'
    }

```

Commit all of the above to your repo.

When updates to the style guide are made, repeat the above and overwrite your
application’s global templates and build directory assets.
