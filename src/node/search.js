module.exports = {
	init: function () {
		console.log('@search::init');
		global.search = {};
		global.search.util = require('full-text-search-light');

		global.search.wrapper = require('./search');
		global.search.wrapper.loadConfig();
	},

	createConfig: function () {
		console.log('@createConfig');
		global.search.config = new global.search.util({
			ignore_case: true,
			index_amount: 12
		});
		global.search.config.save('search.json', function(error){
		    // Load db
			global.search.wrapper.loadConfig();
		});
	},

	saveConfig: function () {
		console.log('@saveConfig');
		// Save current db
		global.search.config.save('search.json', function(error){
		    // Load db
			global.search.wrapper.loadConfig();
		});
	},

	loadConfig: function () {
		console.log('@loadConfig');
		global.search.util.load('search.json', function(error, searchConfig){
			if (error) {
				global.search.wrapper.createConfig();
			}
			else {
				global.search.config = searchConfig;
				console.log('Search has config');
			}
	    });
	},

	addData: function(data) {
		console.log('@addData', data);
		global.search.config.add(data);
		global.search.wrapper.saveConfig();
		return;
	},

	doSearch: function(searchTerm) {
		console.log('@doSearch Search term:', searchTerm.q);
		var results = global.search.config.search(searchTerm.q);
		console.log(results);
		return results;
	}
};
