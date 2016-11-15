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
				dest: 'public/dist/js.js'
			}
		},

		copy: {
			css: {
				files: [
					// includes files within path and its sub-directories
					{
						expand: true,
						flatten: true,
						cwd: 'src/style',
						src: '**',
						dest: 'public/dist'
					}
				],
			},
			jsLib: {
				files: [
					// includes files within path and its sub-directories
					{
						expand: true,
						cwd: 'src/lib',
						src: '**',
						dest: 'public/dist'
					}
				],
			},
			jsPlugins: {
				files: [
					// includes files within path and its sub-directories
					{
						expand: true,
						cwd: 'src/plugins',
						src: '**',
						dest: 'public/plugins'
					}
				],
			},
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
			},
			jsLib: {
				files: ['src/lib/*'],
				tasks: ['copy:jsLib']
			},
			jsPlugins: {
				files: ['src/plugins/*'],
				tasks: ['copy:jsPlugins']
			},
			css: {
				files: ['src/style/*'],
				tasks: ['css']
			}
		}
	});

	// Load tasks
	require('load-grunt-tasks')(grunt);

	// Define tasks
	grunt.registerTask('js', ['jshint:src', 'concat:js', 'jshint:dest']);
	grunt.registerTask('css', ['copy:css']);
	grunt.registerTask('default', ['watch']);
};
