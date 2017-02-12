document.enchiridion.fragments = document.enchiridion.fragments || {};

document.enchiridion.getPlugin = function(formatToRender){
	return new Promise(function(resolve){
		let fileType = formatToRender.split('::')[0];
		require([fileType], plugin => {
			resolve(plugin);
		});
	});
};

window.addEventListener('load', () => {
	document.enchiridion.transclusionContainer = document.getElementById('transclusionContainer');
	let addFragmentButton = document.getElementById('addNewFragment');


	addFragmentButton.addEventListener('click',  () => {
		let placeholder = document.enchiridion.fragmentUtils.makeFragmentPlaceholder();
		document.enchiridion.transclusionContainer.appendChild(placeholder);
	});

	document.enchiridion.transclusionContainer.addEventListener('keypress', e => {
		e.target.classList.add('contentChanged');
		if (e.key === 'Enter') {
			e.preventDefault();
			console.log(e);
			if (e.ctrlKey) {
				console.log('<C-Enter>');
			}
			else if (e.shiftKey) {
				document.enchiridion.transclusion.createNewTransclusion({
					'placeAfter': e.target
				});
			}
			else if (e.altKey) {
				console.log('<M-Enter>');
			}
			else {
				document.enchiridion.transclusion.createParagraph({
					'placeAfter': e.target,
					'innerText': 'Write here from <Enter>',
					id: 'newParagraph',
					focus: true
				});
			}
		}
	});

	document.enchiridion.transclusionContainer.addEventListener('blur',
		e => {

			let format = e.target.parentElement.dataset.format;
			if (format) {
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
