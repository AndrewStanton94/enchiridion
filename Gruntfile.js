'use strict';
module.exports = function(grunt){
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		concat: {
			options: {
				separator: '// Next file\n',
				banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
		'<%= grunt.template.today("yyyy-mm-dd HH:mm") %> */\n'
			},

			js: {
				src: ['src/js/*'],
				dest: 'dist/js.js'
			}
		},

		jshint: {
			options: {
				jshintrc: true,
				reporter: require('jshint-stylish')
			},
			src: '<%= concat.js.src%>',
			dest: '<%= concat.js.dest%>'
		},

		watch: {
			js: {
				files: '<%= concat.js.src%>',
				tasks: ['js']
			}
		}
	});

	// Load tasks
	require('load-grunt-tasks')(grunt);

	// Define tasks
	grunt.registerTask('js', ['jshint:src', 'concat:js', 'jshint:dest']);
	grunt.registerTask('default', ['watch']);
};
