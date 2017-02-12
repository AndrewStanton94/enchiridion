document.enchiridion = document.enchiridion || {};
document.enchiridion.fragmentUtils = {
	// Retrive dataType info from a given form
	getDataType: function(form) {
		let lang = form.querySelector('input[name=lang]').value;
		let format = form.querySelector('input[name=format]').value;
		return `${format}::${lang}`;
	},

	//	When the form is submitted:
	//		Load fragment plugin
	//		Create a fragment
	//		Render the fragment in place of the form
	createFragmentEvent: function(e) {
		let form = e.target.form,
			placeholderElem = form.parentElement,
			format = document.enchiridion.fragmentUtils.getDataType(form);

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
					.then(document.enchiridion.fragmentLoader.extractContent)
					.then(document.enchiridion.fragmentLoader.generateElements)
					.then(transferContainer => {
						placeholderElem.parentElement.replaceChild(transferContainer.element, placeholderElem);
						return transferContainer;
					})
					.then(document.enchiridion.fragmentLoader.addFragmentGenerationElement)
					.catch(e => {throw e;});
			});
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

		datalist.id = listName;
		let options =  data.map(option => `<option value="${option}">`).join('');
		console.log(options);
		datalist.innerHTML = options;
		addTo.appendChild(input);
		addTo.appendChild(datalist);
	},

	//	Generate the form for creating a new fragment
	makeFragmentPlaceholder: function() {
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

		document.enchiridion.fragmentUtils.generateOptionInput(document.enchiridion.config.preferredLanguages, 'lang', f);
		document.enchiridion.fragmentUtils.generateOptionInput(document.enchiridion.config.preferredFormats, 'format', f);
		f.appendChild(button);
		fragmentPlaceholder.appendChild(p);
		fragmentPlaceholder.appendChild(f);

		f.addEventListener('click', e => document.enchiridion.fragmentUtils.createFragmentEvent(e) );
		return fragmentPlaceholder;
	},

	// Set the prototype of a given object
	castToFragment: function(obj) {
		return Object.setPrototypeOf(obj, document.enchiridion.dataStructures.FragmentProto);
	}
};
