define({
	'data': function(transferContainer){
		return transferContainer.fragment.getData(transferContainer.formatToRender);
	},
	'main': function(transferContainer){
		let tContainer = document.createElement('section');
		transferContainer.data.forEach(entry => {
			let element = document.createElement('p');
			if (entry.type) {
				console.log('This is a transclusion or filter: ', entry);
				element.textContent = `${entry.type} of  ${entry.id}`;
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
		console.log('Plain text change handler event:');
		let element = e.target;
		let parentElement = element.parentElement;
		let fragment = document.enchiridion.fragments[parentElement.id];
		console.log(fragment);
		let index = element.dataset.index;
		let dataType = fragment.getData(parentElement.dataset.format);

		if (dataType[index] === element.textContent) {
			console.log('No change to upload');
		}
		else {
			console.log(`The dataStructure says "${dataType}" and the element says "${element.textContent}".`);
			dataType[index] = element.textContent;
			fragment.setData(parentElement.dataset.format, dataType);
			console.log(fragment);
			document.enchiridion.ajax.uploadFragment(fragment, element, this.changeCallback);
		}
			// let data = e.target.textContent;
			// if (data === '') {
			// 	console.warn('Not posting empty data');
			// }
			// console.log(e.target.id, e.target.id === 'newParagraph');
			// if (e.target.id === 'newParagraph') {
			// 	document.enchiridion.ajax.uploadFragment();
			// } else {
			// 	document.enchiridion.ajax.updateFragment( );
			// }
	},
	'changeCallback': function (serverResponse, fragment, elem) {
		console.log('serverResponse: ', serverResponse);
		console.log('fragment: ', fragment);
		console.log('elem: ', elem);
		elem.parentElement.id = serverResponse.fragmentId;
		fragment.setFragmentId(serverResponse.fragmentId);
		elem.classList.remove('contentChanged');
	},
	'create': function () {
		let fragment = document.enchiridion.fragmentUtils.castToFragment({});
		return fragment.constructor('me');
	}
});
