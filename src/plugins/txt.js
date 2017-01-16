define({
	'data': function(transferContainer){
		return transferContainer.fragment.getData(transferContainer.formatToRender).data;
	},
	'main': function(transferContainer){
		var element = document.createElement('p');
		element.textContent = transferContainer.data;
		return element.outerHTML;
	},
	'search': function(fragment){
		console.log(`search ui plugin for ${fragment}`);
	},
	'sidebar': function(fragment){
		console.log(`sidebar ui plugin for ${fragment}`);
	}
});
