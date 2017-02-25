define({
	'data': function(transferContainer){
		return transferContainer.fragment.getData(transferContainer.formatToRender);
	},
	'main': function(transferContainer){
		let tContainer = document.createElement('section'),
			name = transferContainer.fragment.getFragmentName();
		if (name) {
			let fragmentName = document.createElement('h1');
			fragmentName.innerText = name;
			fragmentName.classList.add('fragmentTitle');
			tContainer.appendChild(fragmentName);
		}
		transferContainer.data.forEach(entry => {
			let element = document.createElement('p');
			if (entry.type) {
				document.enchiridion.transclusion.load(entry, element);
			} else {
				element.textContent = entry;
			}
			tContainer.appendChild(element);
		});
		return tContainer;
	},
	'search': function(fragment){
		console.log(`search ui plugin for ${fragment}`);
	},
	'sidebar': function(fragment){
		console.log(`sidebar ui plugin for ${fragment}`);
	},
	'change': function(e) {
		console.log('Plain text change handler event:', e);
		let element = e.target;
		let parentElement = element.parentElement;
		let fragment = document.enchiridion.fragments[parentElement.id];

		let same;

		if (element.classList.contains('fragmentTitle')) {
			let fName = fragment.getFragmentName();
			let eName = element.textContent;
			same = fName === eName;
			fragment.setFragmentName(eName);
		} else {
			let index = element.dataset.index;
			let dataType = fragment.getData(parentElement.dataset.format);
			same = dataType[index] === element.textContent;
			dataType[index] = element.textContent;
			fragment.setData(parentElement.dataset.format, dataType);
		}

		if (same) {
			console.log('No change to upload');
		}
		else {
			console.log(fragment);
			document.enchiridion.ajax.updateFragment(fragment, element, this.changeCallback);
		}
	},
	'changeCallback': function (serverResponse, fragment, elem) {
		console.log('serverResponse: ', serverResponse);
		console.log('fragment: ', fragment);
		console.log('elem: ', elem);
		elem.classList.remove('contentChanged');
	},
	'create': function () {
		let fragment = document.enchiridion.fragmentUtils.castToFragment({});
		return fragment.constructor('me');
	}
});
