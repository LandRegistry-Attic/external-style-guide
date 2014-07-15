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
    }*/

  });

  // Load the plugin that provides the "sass" task: https://github.com/gruntjs/grunt-contrib-sass
  grunt.loadNpmTasks('grunt-contrib-sass');

};