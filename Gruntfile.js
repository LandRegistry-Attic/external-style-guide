module.exports = function(grunt) {

  var globalConfig = {
    govuk_template: {
      css_dev: 'app/static/development/govuk_template/stylesheets/',
      js_dev: 'app/static/development/govuk_template/javascripts/',
      img_dev: 'app/static/development/govuk_template/images/'
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
    'cssmin',
    'sass:build',
    'uglify',
    'copy:govuk_template_img',
  ]);

};