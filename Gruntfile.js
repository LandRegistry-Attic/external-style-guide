module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    /*sass: {
      dev: {
        options: {
            style: 'expanded'
        },
        files: {
          'main.css': 'main.scss'
        }
      },
      dist: {
        options: {
            style: 'compressed'
        },
        files: {
          'main.css': 'main.scss'
        }
      }
    },*/

    /*cssmin: {
      css: {
        src: 'foo.css',
        dest: 'bar.css'
      }
    },*/

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


  // watch task. Does what it says on the tin: https://github.com/gruntjs/grunt-contrib-watch
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Register the various Grunt commands:
  grunt.registerTask('default', ['watch']);

};