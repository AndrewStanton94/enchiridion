/* globals define */
requirejs.config({
    baseUrl: 'plugins',
    paths: {
		qunit: '../dist/qunit/qunit'
    },
	shim: {
       'qunit': {
           exports: 'qunit',
           init: function() {
               QUnit.config.autoload = false;
               QUnit.config.autostart = false;
           }
       }
    }
});
console.log(requirejs);

requirejs(['testPlugin']);
