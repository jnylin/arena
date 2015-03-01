'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    shortBanner: '/*! <%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
		src: ['lib/**/*.js', '!lib/**/*.template.js', '!lib/**/*.old.js'],
        dest: 'dist/<%= pkg.name %>.js'
      },
    },
    uglify: {
      dist: {
        options: {
          banner: '<%= banner %>'
		},
        src: '<%= concat.dist.dest %>',
        dest: 'dist/<%= pkg.name %>.min.js'
      },
      liferay: {
        options: {
          banner: '<%= shortBanner %>'
		},
        expand: true,
        src: ['liferay/*.js', '!liferay/*_dynamicTitle.js', '!liferay/*.old.js', '!liferay/old/*'],
		dest: 'dist/',
		ext: '.min.js',
		extDot: 'first'
      }
    },
    jshint: {
      files: ['Gruntfile.js','<%= concat.dist.src %>'],
      options: {
        jshintrc: '.jshintrc'
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      liferay: {
		src: '<%= uglify.liferay.src %>'
      }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Register tasks
  grunt.registerTask('default', ['jshint', 'concat', 'uglify']);
  grunt.registerTask('lib', ['jshint:files', 'concat', 'uglify:dist']);
  grunt.registerTask('liferay', ['jshint:liferay', 'uglify:liferay']);
  grunt.registerTask('test', ['jshint']);
  grunt.registerTask('test:lib', ['jshint:files']);
  grunt.registerTask('test:liferay', ['jshint:liferay']);

};
