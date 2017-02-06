define({
	'data': function(transferContainer){
		return transferContainer.fragment.getData(transferContainer.formatToRender);
	},
	'main': function(transferContainer){
		let element = document.createElement('img');
		element.src = transferContainer.data;
		return element;
	},
	'search': function(fragment){
		console.log(`search ui plugin for ${fragment}`);
	},
	'sidebar': function(fragment){
		console.log(`sidebar ui plugin for ${fragment}`);
	}
});
