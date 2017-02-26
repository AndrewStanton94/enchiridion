document.enchiridion.fragments = document.enchiridion.fragments || {};

// Get dataType and request plugin that matches the format
// TODO: there's a duplicate of this in fragmentLoader.
// 		Make a single one and adapt the calls
document.enchiridion.getPlugin = function(dataTypeToRender){
	return new Promise(function(resolve){
		let fileType = dataTypeToRender.split('::')[0];
		require([fileType], plugin => {
			resolve(plugin);
		});
	});
};

// Set up stuff
// TODO: Break these out?
window.addEventListener('load', () => {
	// Element where the content goes
	document.enchiridion.transclusionContainer = document.getElementById('transclusionContainer');
	// Fragment creation button
	let addFragmentButton = document.getElementById('addNewFragment');
	// Click the button to produce a fragment placeholder
	addFragmentButton.addEventListener('click',  () => {
		let placeholder = document.enchiridion.fragmentUtils.makeFragmentPlaceholder('newDocument');
		document.enchiridion.transclusionContainer.appendChild(placeholder);
	});


	document.enchiridion.dnd.prepSearch();

	// When leaving a document element call change plugin
	//	If suitable
	document.enchiridion.transclusionContainer.addEventListener('blur',
		e => {
			let dataType = e.target.parentElement.dataset.dataType;
			if (document.enchiridion.fragmentUtils.validateDataType(dataType)) {
				document.enchiridion.getPlugin(e.target.parentElement.dataset.dataType)
					.then(plugin => {plugin.change(e);});
			} else {
				if (e.target.nodeName === 'INPUT') {
					console.log('Is a form');
				} else {
					console.log('This is a new fragment');
				}
			}
		},
		true
	);

	// Perform a search when the content of the searchBox changes
	document.getElementById('searchBox').addEventListener('input', e => {
		console.log(e.target.value);
		let searchResults = document.getElementById('searchResults');
		searchResults.innerHTML = '';
		document.enchiridion.ajax.search({q: e.target.value}, json => {
			json.results.map(match => {
				let fragment = Object.setPrototypeOf(
					match,
					document.enchiridion.dataStructures.FragmentProto
				);
				document.enchiridion.fragmentLoader.processSearchResult(fragment);
			});
		});
	});

	// document.enchiridion.transclusion.init();
	// Load fragment if specified in the url
	let args = location.search.substring(1);
	if (args) {
		// [Strings containing an '='] => Object: {pre-equal: post-equal}
		const stringsToObject = function(acc, val){
			let [key, value] = val.split('=');
			acc[key] = value;
			return acc;
		};
		let hashmap = args.split('&').reduce(stringsToObject, {});

		if (hashmap.f) {
			document.enchiridion.fragmentUtils.getAndProcessFragment(hashmap.f);
		}
		else {
			console.warn('Args don\'t include f');
		}

	}
});
