module.exports = {
	init: function () {
		console.log('@search::init');
		GLOBAL.search = {};
		GLOBAL.search.util = require('full-text-search-light');

		GLOBAL.search.wrapper = require('./search');
		GLOBAL.search.wrapper.loadConfig();
	},

	createConfig: function () {
		console.log('@createConfig');
		GLOBAL.search.config = new GLOBAL.search.util({
			ignore_case: true,
			index_amount: 12
		});
		GLOBAL.search.config.save('search.json', function(error){
		    // Load db
			GLOBAL.search.wrapper.loadConfig();
		});
	},

	saveConfig: function () {
		console.log('@saveConfig');
		// Save current db
		GLOBAL.search.config.save('search.json', function(error){
		    // Load db
			GLOBAL.search.wrapper.loadConfig();
		});
	},

	loadConfig: function () {
		console.log('@loadConfig');
		GLOBAL.search.util.load('search.json', function(error, searchConfig){
			if (error) {
				GLOBAL.search.wrapper.createConfig();
			}
			else {
				GLOBAL.search.config = searchConfig;
				console.log('Search has config');
			}
	    });
	},

	addData: function(data) {
		console.log('@addData', data);
		GLOBAL.search.config.add(data);
		GLOBAL.search.wrapper.saveConfig();
		return;
	},

	doSearch: function(searchTerm) {
		console.log('@doSearch Search term:', searchTerm.q);
		var results = GLOBAL.search.config.search(searchTerm.q);
		console.log(results);
		return results;
	}
};
