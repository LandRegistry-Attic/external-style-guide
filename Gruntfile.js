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
    scss: {
      dev: 'app/static/development/'
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

    sass: {
      dev: {
        options: {
            style: 'expanded',
            loadPath: 'node_modules/govuk_frontend_toolkit/govuk_frontend_toolkit/stylesheets'
        },
        files: {
          '<%= globalConfig.scss.dev %>stylesheets/landregistry-main.css': '<%= globalConfig.scss.dev %>stylesheets/landregistry-main.scss',
          '<%= globalConfig.scss.dev %>style-guide-only/style-guide-only.css': '<%= globalConfig.scss.dev %>style-guide-only/style-guide-only.scss',
          '<%= globalConfig.scss.dev %>stylesheets/service-frontend-pv-shame.css': '<%= globalConfig.scss.dev %>stylesheets/service-frontend-pv-shame.scss',
          '<%= globalConfig.scss.dev %>stylesheets/property-frontend-pv-shame.css': '<%= globalConfig.scss.dev %>stylesheets/property-frontend-pv-shame.scss',
          '<%= globalConfig.scss.dev %>stylesheets/property-frontend-sr-shame.css': '<%= globalConfig.scss.dev %>stylesheets/property-frontend-sr-shame.scss'
        }
      },
      build: {
        options: {
            style: 'compressed',
            loadPath: 'node_modules/govuk_frontend_toolkit/govuk_frontend_toolkit/stylesheets'
        },
        files: {
          '<%= globalConfig.build.css %>landregistry-main.css': '<%= globalConfig.scss.dev %>stylesheets/landregistry-main.scss',
          '<%= globalConfig.build.css %>service-frontend-pv-shame.css': '<%= globalConfig.scss.dev %>stylesheets/service-frontend-pv-shame.scss',
          '<%= globalConfig.build.css %>property-frontend-pv-shame.css': '<%= globalConfig.scss.dev %>stylesheets/property-frontend-pv-shame.scss',
          '<%= globalConfig.build.css %>property-frontend-sr-shame.css': '<%= globalConfig.scss.dev %>stylesheets/property-frontend-sr-shame.scss'
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
        cwd: '<%= globalConfig.govuk_template.css_dev %>', // set working folder / root to copy
        src: '**/*', // copy all files and subfolders
        dest: '<%= globalConfig.build.css %>', // destination folder
        expand: true // required when using cwd
      },
      govuk_template_img: {
        cwd: '<%= globalConfig.govuk_template.img_dev %>',
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

    uglify: {

      /*options: {
        mangle: false
      },*/

      govuk_template_js: {
        files: [{
          expand: true,
          cwd: '<%= globalConfig.govuk_template.js_dev %>',
          src: '**/*.js',
          dest: '<%= globalConfig.build.js %>'
        }]
      }
    },

    watch: {
      css: {
        files: ['<%= globalConfig.scss.dev %>**/*.scss'],
        tasks: ['sass:dev'],
        options: {
          spawn: false,
        }
      }
    },

    shell: {
      makeDir: {
        command: 'python app/server.py'
      }
    },

    concurrent: {
      target: {
        tasks: ['watch', 'shell'],
        options: {
          logConcurrentOutput: true
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

  // Shell - run shell script tasks: https://github.com/sindresorhus/grunt-shell
  grunt.loadNpmTasks('grunt-shell');

  // Concurrent - allows us to run the server and the watch at the same time: https://github.com/sindresorhus/grunt-concurrent
  grunt.loadNpmTasks('grunt-concurrent');

  // Register the various Grunt commands:

  // 1: Default task - watch for changes in landregistry elements, and serve the app
  grunt.registerTask('default', ['concurrent']);

  // 2: Build task - copy and min ALL files to static/build/ maintaining the file structure
  grunt.registerTask('build', [
    'copy:govuk_template_css',
    'cssmin:minify',
    'sass:build',
    'uglify',
    'copy:govuk_template_img',
    'copy:leaflet_js',
    'cssmin:leaflet_js',
  ]);

  // 3: Update task - copy updates to govuk assets
  grunt.registerTask('update', ['copy:govuk_toolkit_js']);

};