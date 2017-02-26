document.enchiridion = document.enchiridion || {};
document.enchiridion.fragmentLoader = {
	// Use an ID to get the fragment from a list of fragments
	retrieveFragment: function(id, fragments){
		let matchesId = f => f.getFragmentId() === id;
		let fragment = fragments.find(matchesId);
		return fragment;
	},

	// like python `in`
	inCollection: function(item, collection){
		return collection.indexOf(item) >= 0;
	},

	// Given the dataTypes of a fragment
	//		Get the Format or Language (use index)
	//		Keep values that match the list in validOptions
	filterFormats: function(list, sliceIndex, validOptions){
		return list.filter(function(key){
			return document.enchiridion.fragmentLoader.inCollection(key.split('::')[sliceIndex], validOptions);
		});
	},

	// Take a fragment, filter dataTypes by language then format
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
	//	TODO: Move out wrapping in TransferContainer.
	//		Prevents the duplication of this function to bypass that
	getPlugin: function(dataTypeToRender, fragment){
		return new Promise(function(resolve){
			let fileType = dataTypeToRender[0]		// First accepted datatype
								.split('::')[0];		// The format
			require([fileType], plugin => {
				resolve(new document.enchiridion.dataStructures.TransferContainer(fragment, plugin, dataTypeToRender));
			});
		});
	},

	// Extract data from fragment using the plugin
	extractContent: function(transferContainer){
		transferContainer.data = transferContainer.plugins.data(transferContainer);
		return transferContainer;
	},

	// Create the elements to contain the data from the fragment dataType
	generateElements: transferContainer => {
		let content = transferContainer.plugins.main(transferContainer);

		// Add id and datatype to element
		content.id = transferContainer.fragment.getFragmentId();
		content.dataset.dataType = transferContainer.dataTypeToRender;
		content.classList.add('fragment');

		// Give each fragment item an index
		[...content.querySelectorAll('*:not(h1):not(br)')].forEach((elem, index) => {
			elem.dataset.index = index;
		});
		// Elements are editable
		[...content.children].forEach((elem) => {
			elem.classList.add('fragmentEntry');
			elem.contentEditable = true;
		});

		transferContainer.element = content;
		return transferContainer;
	},

	// Create the search result elements
	generateSearchResult: transferContainer => {
		let content = transferContainer.plugins.search(transferContainer);

		// Add id and datatype to element
		content.id = transferContainer.fragment.getFragmentId();
		content.classList.add('fragment');
		content.classList.add('searchResult');
		let activate = document.createElement('span');
		activate.innerText = 'Click here to select this document';
		activate.addEventListener('click', e => {
			console.log(e);
			document.enchiridion.transclusionContainer.innerHTML = '';
			document.enchiridion.fragmentUtils.getAndProcessFragment(e.target.parentElement.id);
		});
		content.appendChild(activate);
		transferContainer.element = content;
		return transferContainer;
	},

	// Append the fragment to the document
	draw: function(transferContainer){
		document.getElementById('transclusionContainer').insertBefore(transferContainer.element, null);
		return transferContainer;
	},

	// Append the fragment to the document
	drawSearchResult: function(transferContainer){
		document.getElementById('searchResults').insertBefore(transferContainer.element, null);
		return transferContainer;
	},

	// Place an element after the fragment to handle inserting a new fragment
	// TODO: Consider moving out of the Promise chain
	addFragmentGenerationElement: function(transferContainer) {
		let content = transferContainer.element,
			newFragment = document.createElement('div');

		// Click element to create a ui for a new fragment
		newFragment.innerText = 'Create a new fragment here';
		newFragment.addEventListener('click', e => {
			console.log('Creating new fragment', e);
			let placeholder = document.enchiridion.fragmentUtils.makeFragmentPlaceholder();
			let toRemove = e.target;
			toRemove.parentElement.replaceChild(placeholder, toRemove);
		});
		console.log(content.nextSiblingElement);
		content.parentElement.insertBefore(newFragment, content.nextSiblingElement);
	},

	// Get plugin, then use the data one and pass it to a renderer
	processFragment: function(fragment) {
		let dataTypeToRender = document.enchiridion.fragmentLoader.selectFormat(fragment);
		document.enchiridion.fragmentLoader.getPlugin(dataTypeToRender, fragment)
		.then(document.enchiridion.fragmentLoader.extractContent)
		.then(document.enchiridion.fragmentLoader.generateElements)
		.then(document.enchiridion.fragmentLoader.draw)
		.then(document.enchiridion.fragmentLoader.addFragmentGenerationElement);
	},

	// Get plugin, then use the data one and pass it to a renderer
	processSearchResult: function(fragment) {
		let dataTypeToRender = document.enchiridion.fragmentLoader.selectFormat(fragment);
		document.enchiridion.fragmentLoader.getPlugin(dataTypeToRender, fragment)
		.then(document.enchiridion.fragmentLoader.generateSearchResult)
		.then(document.enchiridion.fragmentLoader.drawSearchResult);
	}
};
