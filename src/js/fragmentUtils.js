document.enchiridion = document.enchiridion || {};
document.enchiridion.fragmentUtils = {
	// Retrive dataType info from a given form
	getDataType: function(form) {
		let lang = form.querySelector('input[name=lang]').value;
		let format = form.querySelector('input[name=format]').value;
		return `${format}::${lang}`;
	},

	// Dumb letters::letters regex
	// TODO: Replace this with a check against a list of the plugins available on the server
	validateDataType: function(dataType) {
		let re = /\w+::\w+/;
		return dataType
			&& (dataType.match(re) !== null);
	},

	//	When the form is submitted:
	//		Load fragment plugin
	//		Create a fragment
	//		Render the fragment in place of the form
	createFragmentEvent: function(e) {
		let form = e.target.form,
			placeholderElem = form.parentElement,
			dataType = document.enchiridion.fragmentUtils.getDataType(form);
		let currentPlugin;

		if (document.enchiridion.fragmentUtils.validateDataType(dataType)) {
			document.enchiridion.getPlugin(dataType)
				.then(plugin => {
					currentPlugin = plugin;
					let fragment = plugin.create()
						.setData(dataType, [placeholderElem.children[1].innerText]);
					if (placeholderElem.children[0].innerText !== 'title') {
						fragment.setFragmentName(placeholderElem.children[0].innerText);
					}
					return {fragment};
				})
				/// Send data to server
				.then(data => {
					return new Promise(function(resolve) {
						document.enchiridion.ajax.uploadFragment(data.fragment, data.elem, res => {
							// Add server allocated id and save local copy using it
							let {fragment} = data;
							fragment.setFragmentId(res.fragmentId);
							document.enchiridion.fragments[res.fragmentId] = fragment;
							resolve(fragment);
						});
					});
				})
				.then(fragment => {
					return new Promise(function(resolve) {
						let location = placeholderElem.dataset.placeAfter;
						console.log('location: ', location );
						// Do I need to wrap the fragment in another
						// If so, get, make and upload it
						let transclusion = {
							'type': 'transclusion',
							'id': fragment.getFragmentId(),
							'dataType': dataType
						};
						console.log('transclusion', transclusion);
						if (location === 'newDocument') {
							let container = currentPlugin.create()
								.setData(dataType, [transclusion]);
							console.log('Made container', container);

							document.enchiridion.ajax.uploadFragment(container, undefined, res => {
								// Add server allocated id and save local copy using it
								console.log('res container', res);
								container.setFragmentId(res.fragmentId);
								document.enchiridion.fragments[res.fragmentId] = container;
								resolve(container);
							});
						} else {
							let containerId = placeholderElem.parentElement.id,
								containerFragment = document.enchiridion.fragments[containerId];
							let data = containerFragment.getData(dataType);
							data.push(transclusion);
							containerFragment.setData(dataType, data);
							document.enchiridion.ajax.updateFragment(containerFragment, null, x => {console.log(x);});
							resolve(fragment);
						}
					});
				})
				.then(fragment => {
					console.log('frg', fragment);
					document.enchiridion.fragmentLoader.getPlugin([dataType], fragment)
						.then(document.enchiridion.fragmentLoader.extractContent)
						.then(document.enchiridion.fragmentLoader.generateElements)
						.then(transferContainer => {
							placeholderElem.parentElement.replaceChild(transferContainer.element, placeholderElem);
							return transferContainer;
						})
						.then(document.enchiridion.fragmentLoader.addFragmentGenerationElement)
						.catch(e => {throw e;});
				});
		}
	},

	// Creats a input and used datalist from a given collection
	// 	Placed here because this is where it is used
	generateOptionInput: function(data, name, addTo) {
		let listName =  name + 'list',
			input = document.createElement('input'),
			datalist = document.createElement('datalist');

		input.name = name;
		input.placeholder = name;
		input.setAttribute('list', listName);
		input.value = data[0];

		datalist.id = listName;
		let options =  data.map(option => `<option value="${option}">`).join('');
		datalist.innerHTML = options;
		addTo.appendChild(input);
		addTo.appendChild(datalist);
	},

	//	Generate the form for creating a new fragment
	makeFragmentPlaceholder: function(placeAfter) {
		let fragmentPlaceholder = document.createElement('section'),
			title = document.createElement('h1'),
			p = document.createElement('p'),
			f = document.createElement('form'),
			button = document.createElement('button');

		title.innerText = 'title';
		title.contentEditable = true;
		p.innerText = 'test';
		p.contentEditable = true;
		button.innerText = 'Press to create fragment';
		button.name = 'createFragment';
		button.type = 'button';
		fragmentPlaceholder.classList.add('overlayContent');
		console.log('Setting placeAfter as', placeAfter);
		fragmentPlaceholder.dataset.placeAfter = placeAfter;

		document.enchiridion.fragmentUtils.generateOptionInput(document.enchiridion.config.preferredLanguages, 'lang', f);
		document.enchiridion.fragmentUtils.generateOptionInput(document.enchiridion.config.preferredFormats, 'format', f);
		f.appendChild(button);
		fragmentPlaceholder.appendChild(title);
		fragmentPlaceholder.appendChild(p);
		fragmentPlaceholder.appendChild(f);

		button.addEventListener('click', e => document.enchiridion.fragmentUtils.createFragmentEvent(e));
		return fragmentPlaceholder;
	},

	// Set the prototype of a given object
	castToFragment: function(obj) {
		return Object.setPrototypeOf(obj, document.enchiridion.dataStructures.FragmentProto);
	}
};
