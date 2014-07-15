module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    /*sass: {
      dist: {
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

  });

  // Load the plugin that provides the "sass" task: https://github.com/gruntjs/grunt-contrib-sass
  grunt.loadNpmTasks('grunt-contrib-sass');

  // css-min task - used to minify straight css files (i.e. the govuk_template files): https://github.com/gruntjs/grunt-contrib-cssmin
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // Register the various Grunt commands:
  grunt.registerTask('default', ['sass']);

};