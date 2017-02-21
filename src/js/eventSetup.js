document.enchiridion.fragments = document.enchiridion.fragments || {};

// Get dataType and request plugin that matches the format
// TODO: there's a duplicate of this in fragmentLoader.
// 		Make a single one and adapt the calls
document.enchiridion.getPlugin = function(formatToRender){
	return new Promise(function(resolve){
		let fileType = formatToRender.split('::')[0];
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

	// When leaving a document element call change plugin
	//	If suitable
	document.enchiridion.transclusionContainer.addEventListener('blur',
		e => {
			let format = e.target.parentElement.dataset.format;
			if (document.enchiridion.fragmentUtils.validateDataType(format)) {
				document.enchiridion.getPlugin(e.target.parentElement.dataset.format)
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
				console.log('A match', match);
				document.enchiridion.transclusion.createParagraph({
					container: searchResults,
					innerText: match.data,
					id: match.fId
				});
			});
		});
	});

	// document.enchiridion.transclusion.init();
});
