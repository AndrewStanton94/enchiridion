document.enchiridion.fragments = document.enchiridion.fragments || {};
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

document.enchiridion.getDataType = function(form) {
	let lang = form.querySelector('input[name=lang]').value;
	let format = form.querySelector('input[name=format]').value;
	return `${format}::${lang}`;
};

document.enchiridion.createFragmentEvent = function(e) {
	let form = e.target.form,
		placeholderElem = form.parentElement,
		format = document.enchiridion.getDataType(form);

	console.log(format);
	document.enchiridion.getPlugin(format)
		.then(plugin => plugin.create(placeholderElem, format))
		/// Send data to server
		.then(data => {
			return new Promise(function(resolve) {
				document.enchiridion.ajax.uploadFragment(data.fragment, data.elem, res => {
					// Add server allocated id and save local copy using it
					data.fragment.setFragmentId(res.fragmentId);
					document.enchiridion.fragments[res.fragmentId] = data.fragment;
					resolve(data.fragment);
				});
			});
		})
		.then(fragment => {
			console.log('frg', fragment);
			document.enchiridion.fragmentLoader.getPlugin([format], fragment)
				.then(x => {console.log('Has plugin'); return x;})
				.then(document.enchiridion.fragmentLoader.extractContent)
				.then(x => {console.log('Extracted content'); return x;})
				.then(document.enchiridion.fragmentLoader.generateElements)
				.then(transferContainer => {
					placeholderElem.parentElement.replaceChild(transferContainer.element, placeholderElem);
				})
				.then(document.enchiridion.fragmentLoader.addFragmentGenerationElement)
				.catch(e => {throw e;});

		});
};

document.enchiridion.makeFragmentPlaceholder = function() {
	let fragmentPlaceholder = document.createElement('section'),
		p = document.createElement('p'),
		f = document.createElement('form'),
		button = document.createElement('button');

	p.innerText = 'test';
	p.contentEditable = true;
	button.innerText = 'Press to create fragment';
	button.name = 'createFragment';
	button.type = 'button';
	fragmentPlaceholder.classList.add('overlayContent');

	document.enchiridion.generateOptionInput(document.enchiridion.config.preferredLanguages, 'lang', f);
	document.enchiridion.generateOptionInput(document.enchiridion.config.preferredFormats, 'format', f);
	f.appendChild(button);
	fragmentPlaceholder.appendChild(p);
	fragmentPlaceholder.appendChild(f);

	f.addEventListener('click', e => document.enchiridion.createFragmentEvent(e) );
	return fragmentPlaceholder;
};

document.enchiridion.getPlugin = function(formatToRender){
	return new Promise(function(resolve){
		let fileType = formatToRender.split('::')[0];
		require([fileType], plugin => {
			resolve(plugin);
		});
	});
};

document.enchiridion.castToFragment = function(obj) {
	return Object.setPrototypeOf(obj, document.enchiridion.dataStructures.FragmentProto);
};

window.addEventListener('load', () => {
	document.enchiridion.transclusionContainer = document.getElementById('transclusionContainer');
	let addFragmentButton = document.getElementById('addNewFragment');


	addFragmentButton.addEventListener('click',  () => {
		let placeholder = document.enchiridion.makeFragmentPlaceholder();
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
