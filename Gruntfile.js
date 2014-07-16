module.exports = function(grunt) {

  var globalConfig = {
    govuk_template: {
      css_dev: 'app/static/development/govuk-template/stylesheets/',
      js_dev: 'app/static/development/govuk-template/javascripts/',
      img_dev: 'app/static/development/govuk-template/images/'
    },
    scss: {
      dev: 'app/static/development/stylesheets/'
    },
    build: {
      css: 'app/static/build/stylesheets/',
      js: 'app/static/build/javascripts/',
      img: 'app/static/build/images/'
    }
  };

  // Project configuration.
  grunt.initConfig({

    globalConfig: globalConfig,

    pkg: grunt.file.readJSON('package.json'),

    sass: {
      dev: {
        options: {
            style: 'expanded'
        },
        files: {
          '<%= globalConfig.scss.dev %>landregistry_main.css': '<%= globalConfig.scss.dev %>landregistry_main.scss'
        }
      },
      build: {
        options: {
            style: 'compressed'
        },
        files: {
          '<%= globalConfig.build.css %>landregistry_main.css': '<%= globalConfig.scss.dev %>landregistry_main.scss'
        }
      }
    },

    cssmin: {
      minify: {
        expand: true,
        cwd: '<%= globalConfig.build.css %>',
        src: '*.css',
        dest: '<%= globalConfig.build.css %>'
      }
    },

    copy: {
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

    /*watch: {
      css: {
        files: ['path-to-files'],
        tasks: ['sass:dev'],
        options: {
          spawn: false,
        }
      }
    },*/

  });

  // Load the plugin that provides the "sass" task: https://github.com/gruntjs/grunt-contrib-sass
  grunt.loadNpmTasks('grunt-contrib-sass');

  // css-min task - used to minify straight css files (i.e. the govuk_template files): https://github.com/gruntjs/grunt-contrib-cssmin
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // copy task
  grunt.loadNpmTasks('grunt-contrib-copy');

  // js uglify
  grunt.loadNpmTasks('grunt-contrib-uglify');


  // watch task. Does what it says on the tin: https://github.com/gruntjs/grunt-contrib-watch
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Register the various Grunt commands:
  grunt.registerTask('default', ['sass:dev']);

  grunt.registerTask('build', [
    'copy:govuk_template_css',
    'cssmin',
    'sass:build',
    'uglify',
    'copy:govuk_template_img',
  ]);

};