document.enchiridion = document.enchiridion || {};
document.enchiridion.fragmentLoader = {
	retrieveFragment: function(id, fragments){
		let matchesId = f => f.getFragmentId() === id;
		let fragment = fragments.find(matchesId);
		return fragment;
	},

	// like python `in`
	inCollection: function(item, collection){
		return collection.indexOf(item) >= 0;
	},

	filterFormats: function(list, sliceIndex, validOptions){
		return list.filter(function(key){
			return document.enchiridion.fragmentLoader.inCollection(key.split('::')[sliceIndex], validOptions);
		});
	},

	selectFormat: function(fragment){
		let renderType = fragment.getFormats();
		if(renderType.length > 1){
			renderType = document.enchiridion.fragmentLoader.filterFormats(renderType, 1, document.enchiridion.config.preferredLanguages);
			console.log('After language filter: ', renderType);
		}
		if(renderType.length > 1){
			renderType = document.enchiridion.fragmentLoader.filterFormats(renderType, 0, document.enchiridion.config.preferredFormats);
			console.log('After type filter: ', renderType);
		}
		return renderType;
	},

	// A promise that will do the plugin lookup
	getPlugin: function(formatToRender, fragment){
		return new Promise(function(resolve){
			let fileType = formatToRender[0]		// First accepted datatype
								.split('::')[0];		// The format
			require([fileType], plugin => {
				resolve(new document.enchiridion.dataStructures.TransferContainer(fragment, plugin, formatToRender));
			});
		});
	},

	extractContent: function(transferContainer){
		transferContainer.data = transferContainer.plugins.data(transferContainer);
		return transferContainer;
	},

	generateElements: transferContainer => {
		transferContainer.element = transferContainer.plugins.main(transferContainer);
		return transferContainer;
	},

	draw: function(transferContainer){
		let content = transferContainer.element,
			newFragment = document.createElement('div');
		// content.draggable = true;
		[...content.children].forEach((elem, index) => {
			elem.contentEditable = true;
			elem.dataset.index = index;
		});
		content.id = transferContainer.fragment.getFragmentId();
		content.dataset.format = transferContainer.formatToRender;
		document.getElementById('transclusionContainer').insertBefore(content, null);
		newFragment.innerText = 'Create a new fragment here';
		newFragment.addEventListener('click', e => {
			console.log('Creating new fragment', e);
			let placeholder = document.enchiridion.makeFragmentPlaceholder();
			let toRemove = e.target;
			toRemove.parentElement.replaceChild(placeholder, toRemove);
		});
		content.parentElement.insertBefore(newFragment, content.parentElement.nextSiblingElement);
	},

	// Get plugin, then use the data one and pass it to a renderer
	processFragment: function(fragment) {
		let formatToRender = document.enchiridion.fragmentLoader.selectFormat(fragment);
		document.enchiridion.fragmentLoader.getPlugin(formatToRender, fragment)
		.then(document.enchiridion.fragmentLoader.extractContent)
		.then(document.enchiridion.fragmentLoader.generateElements)
		.then(document.enchiridion.fragmentLoader.draw);
	}
};
