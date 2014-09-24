module.exports = function(grunt) {

  var globalConfig = {
    govuk_toolkit: {
      js: {
        path: 'node_modules/govuk_frontend_toolkit/govuk_frontend_toolkit/javascripts/',
        files: [
          'govuk/selection-buttons.js',
          'vendor/polyfills/bind.js'
        ]
      }
    },
    govuk_template: {
      css_dev: 'app/static/development/govuk-template/stylesheets/',
      js_dev: 'app/static/development/govuk-template/javascripts/',
      img_dev: 'app/static/development/govuk-template/images/'
    },
    development: {
      scss: 'app/static/development/',
      css: 'app/static/development/stylesheets/',
      js: 'app/static/development/javascripts/',
      img: 'app/static/development/images/'
    },
    build: {
      css: 'app/static/build/stylesheets/',
      js: 'app/static/build/javascripts/',
      img: 'app/static/build/images/'
    },
    vendor: {
      leaflet_js: 'app/static/development/vendor/leaflet-0-7-3/'
    }
  };

  // Project configuration.
  grunt.initConfig({

    globalConfig: globalConfig,

    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      all: ['Gruntfile.js', '<%= globalConfig.development.js %>govuk/*.js']
    },

    sass: {
      dev: {
        options: {
          style: 'expanded',
          loadPath: 'node_modules/govuk_frontend_toolkit/govuk_frontend_toolkit/stylesheets'
        },
        files: {
          '<%= globalConfig.development.scss %>stylesheets/landregistry-main.css': '<%= globalConfig.development.scss %>stylesheets/landregistry-main.scss',
          '<%= globalConfig.development.scss %>style-guide-only/style-guide-only.css': '<%= globalConfig.development.scss %>style-guide-only/style-guide-only.scss'
        }
      },
      build: {
        options: {
          style: 'compressed',
          loadPath: 'node_modules/govuk_frontend_toolkit/govuk_frontend_toolkit/stylesheets'
        },
        files: {
          '<%= globalConfig.build.css %>landregistry-main.css': '<%= globalConfig.development.scss %>stylesheets/landregistry-main.scss'
        }
      }
    },

    cssmin: {
      minify: {
        expand: true,
        cwd: '<%= globalConfig.build.css %>',
        src: '*.css',
        dest: '<%= globalConfig.build.css %>'
      },
      leaflet_js: {
        expand: true,
        cwd: '<%= globalConfig.build.js %>/vendor/leaflet/',
        src: '*.css',
        dest: '<%= globalConfig.build.js %>/vendor/leaflet/'
      }
    },

    copy: {
      govuk_toolkit_js: {
        cwd: '<%= globalConfig.govuk_toolkit.js.path %>',
        src: globalConfig.govuk_toolkit.js.files,
        dest: 'app/static/development/javascripts',
        expand: true
      },
      govuk_template_css: {
        cwd: '<%= globalConfig.govuk_template.css_dev %>',
        src: '**/*',
        dest: '<%= globalConfig.build.css %>',
        expand: true
      },
      govuk_template_img: {
        cwd: '<%= globalConfig.govuk_template.img_dev %>',
        src: '**/*',
        dest: '<%= globalConfig.build.img %>',
        expand: true
      },
      images: {
        cwd: '<%= globalConfig.development.img %>',
        src: '**/*',
        dest: '<%= globalConfig.build.img %>',
        expand: true
      },
      leaflet_js: {
        cwd: '<%= globalConfig.vendor.leaflet_js %>',
        src: '**/*',
        dest: '<%= globalConfig.build.js %>/vendor/leaflet/',
        expand: true
      }
    },

    concat: {
      options: {
        separator: "\n", // add new line after each file
      },
      dist: {
        src: [
          '<%= globalConfig.development.js %>vendor/polyfills/*',
          '<%= globalConfig.development.js %>vendor/*',
          '<%= globalConfig.development.js %>govuk/*',
          '<%= globalConfig.development.js %>landregistry/*',
          '<%= globalConfig.development.js %>document-ready.js'
        ],
        dest: '<%= globalConfig.build.js %>land-registry-scripts.js'
      }
    },

    uglify: {
      govuk_template_js: {
        files: [{
          expand: true,
          cwd: '<%= globalConfig.build.js %>',
          src: '**/*.js',
          dest: '<%= globalConfig.build.js %>'
        }]
      }
    },

    watch: {
      css: {
        files: ['<%= globalConfig.development.scss %>**/*.scss'],
        tasks: ['sass:dev'],
        options: {
          spawn: false,
        }
      }
    }

  });

  // Load the plugin that provides the "sass" task: https://github.com/gruntjs/grunt-contrib-sass
  grunt.loadNpmTasks('grunt-contrib-sass');

  // css-min task - used to minify straight css files (i.e. the govuk_template files): https://github.com/gruntjs/grunt-contrib-cssmin
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // copy task: https://github.com/gruntjs/grunt-contrib-copy
  grunt.loadNpmTasks('grunt-contrib-copy');

  // js uglify: https://github.com/gruntjs/grunt-contrib-uglify
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // watch task. Does what it says on the tin: https://github.com/gruntjs/grunt-contrib-watch
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Concat - used to concatenate files, mainly for js
  grunt.loadNpmTasks('grunt-contrib-concat');

  // js hint task: https://github.com/gruntjs/grunt-contrib-jshint
  grunt.loadNpmTasks('grunt-contrib-jshint');


  // Register the various Grunt commands:

  // 1: Default task - watch for changes in landregistry scss
  grunt.registerTask('default', ['watch']);

  // 2: Build task - copy and min ALL files to static/build/ maintaining the file structure
  grunt.registerTask('build', [
    'copy:govuk_template_css',
    'cssmin:minify',
    'sass:build',
    'concat',
    'uglify',
    'copy:govuk_template_img',
    'copy:images',
    'copy:leaflet_js',
    'cssmin:leaflet_js'
  ]);

  // 3: Update task - copy updates to govuk assets
  grunt.registerTask('update', ['copy:govuk_toolkit_js']);

};