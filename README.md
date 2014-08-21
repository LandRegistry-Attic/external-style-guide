style-guide
===========

Canonical source of markup patterns and css for Land Registry applications.

## Introduction

The style-guide is a [Flask](http://flask.pocoo.org/) application, with [Grunt](http://gruntjs.com/) workflow to generate assets.

It includes:

* [GOVUK frontend toolkit](https://github.com/alphagov/govuk_frontend_toolkit) (as a [node package](https://www.npmjs.org/package/govuk_frontend_toolkit))
* [GOVUK template](https://github.com/alphagov/govuk_template)
* [GOVUK elements](https://github.com/alphagov/govuk_elements)
* [leaflet js - 0.7.3](http://leafletjs.com/download.html)

## How does it contribute to Land Registry applications?

Applications that have a front end should consume the following assets:

* /app/static/build/*
* /app/templates/global/*

Currently (01-08-2014) those applications are [property-frontend](https://github.com/LandRegistry/property-frontend) and [service-frontend](https://github.com/LandRegistry/service-frontend).

"Consuming" is simply a case of making sure assets are up to date - this is *currently* a manual task. Simply check out the style-guide repo, then copy across the assets mentioned above.

See [below](#user-content-using-the-base-templates-and-assets-in-land-registry-flask-projects) for more details.

## Style guide requirements

### [Node](http://nodejs.org/)

You may already have it, try:

```
node --version
```

### [Grunt](http://gruntjs.com)

Make sure you've installed the Grunt command line interface --- see http://gruntjs.com/getting-started

### The [Sass](http://sass-lang.com/) ruby gem

You probably already have Ruby installed, try

```
ruby -v
```

When you've confirmed you have Ruby installed, run ```gem install sass``` to install Sass.

## Getting started

Once you've got the requirements in place, get the [development environment](https://github.com/LandRegistry/development-environment) installed - style guide runs within this. You can run the style guide alone or as part of ```lr-run-all-apps``` - see the README for [development environment](https://github.com/LandRegistry/development-environment).

## Watching sass files

* To have sass files watched while you're working: ```grunt```

When running the app with ```grunt``` you will be linked to development assets (i.e. non-minified). This will be shown in the footer of the style guide:

![Footer message showing development assets](https://github.com/LandRegistry/style-guide/blob/gh-pages/readme-images/using-dev-assets.png)

## Creating build assets

* To build minified and concatenated production assets: ```grunt build```


*THIS SECTION NEEDS WORK - need to work this out in the development environment*

You will want to *test* your build files before you submit a pull request for them!

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

To use leaflet include the following in your base template (head_additionals because leaflet requires the js to be loaded before the page content has fully rendered)

```
{% block head_additionals %}
  <script src="{{ asset_path }}javascripts/vendor/leaflet/leaflet.js" type="text/javascript"></script>
  <link href="{{ asset_path }}javascripts/vendor/leaflet/leaflet.css" media="all" rel="stylesheet" type="text/css" />
{% endblock %}

```

Commit all of the above to your repo.

When updates to the style guide are made, repeat the above and overwrite
your application’s global templates and build directory assets.
