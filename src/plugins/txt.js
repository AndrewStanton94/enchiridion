define({
	'data': function(params){
		console.log(params);
		var data = params.fragment.data[params.dataType];
		return data;
	},
	'main': function(params){
		var element = document.createElement('p');
		element.textContent = params.data;
		return element.outerHTML;
	},
	'search': function(fragment){
		console.log(`search ui plugin for ${fragment}`);
	},
	'sidebar': function(fragment){
		console.log(`sidebar ui plugin for ${fragment}`);
	}
});
