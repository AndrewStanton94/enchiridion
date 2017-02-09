document.enchiridion.generateOptionInput = function(data, name, addTo) {
	let listName =  name + 'list',
		input = document.createElement('input'),
		datalist = document.createElement('datalist');

	input.name = name;
	input.placeholder = name;
	input.setAttribute('list', listName);

	datalist.id = listName;
	let options =  data.map(option => `<option value="${option}">`).join('');
	console.log(options);
	datalist.innerHTML = options;
	addTo.appendChild(input);
	addTo.appendChild(datalist);
};
window.addEventListener('load', () => {
	document.enchiridion.transclusionContainer = document.getElementById('transclusionContainer');
	let addFragmentButton = document.getElementById('addNewFragment');


	addFragmentButton.addEventListener('click',  () => {
		let fragmentPlaceholder = document.createElement('section'),
			p = document.createElement('p'),
			f = document.createElement('form');

		p.innerText = 'test';
		p.contentEditable = true;
		document.enchiridion.generateOptionInput(document.enchiridion.config.preferredLanguages, 'lang', f);
		document.enchiridion.generateOptionInput(document.enchiridion.config.preferredFormats, 'format', f);

		fragmentPlaceholder.appendChild(p);
		fragmentPlaceholder.appendChild(f);
		document.enchiridion.transclusionContainer.appendChild(fragmentPlaceholder);
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

	document.enchiridion.transclusionContainer.addEventListener( 'blur',
		e => {
			let getPlugin = function(formatToRender){
				return new Promise(function(resolve){
					let fileType = formatToRender.split('::')[0];
					require([fileType], plugin => {
						resolve(plugin);
					});
				});
			};

			let format = e.target.parentElement.dataset.format;
			if (format) {
				getPlugin(e.target.parentElement.dataset.format)
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
