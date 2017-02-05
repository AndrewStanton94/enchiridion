define({
	'data': function(transferContainer){
		return transferContainer.fragment.getData(transferContainer.formatToRender).data;
	},
	'main': function(transferContainer){
		let element = document.createElement('p');
		element.textContent = transferContainer.data;
		return element;
	},
	'search': function(fragment){
		console.log(`search ui plugin for ${fragment}`);
	},
	'sidebar': function(fragment){
		console.log(`sidebar ui plugin for ${fragment}`);
	}
});
