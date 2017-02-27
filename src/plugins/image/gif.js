define({
	'data': function(transferContainer){
		return transferContainer.fragment.getData(transferContainer.dataTypeToRender);
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
			let element = document.createElement('img');
			if (entry.type) {
				document.enchiridion.transclusion.load(entry, element);
			} else {
				element.src = transferContainer.data;
			}
			tContainer.appendChild(element);
		});
		return tContainer;
	},
	'search': function(transferContainer){
		let elem = document.createElement('p');
		let name = transferContainer.fragment.getFragmentName();
		if (!name) {
			name = 'Placeholder';
		}
		elem.innerText = name;
		return elem;
	},
	'sidebar': function(fragment){
		console.log(`sidebar ui plugin for ${fragment}`);
	},

	'create': function () {
		let fragment = document.enchiridion.fragmentUtils.castToFragment({});
		return fragment.constructor('me');
	}
});
