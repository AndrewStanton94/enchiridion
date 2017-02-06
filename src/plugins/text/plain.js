define({
	'data': function(transferContainer){
		return transferContainer.fragment.getData(transferContainer.formatToRender);
	},
	'main': function(transferContainer){
		let tContainer = document.createElement('section');
		transferContainer.data.forEach(entry => {
			let element = document.createElement('p');
			element.textContent = entry;
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
		console.log(e);
		let element = e.target;
		let parentElement = element.parentElement;
		let fragment = document.enchiridion.fragments[parentElement.id];
		console.log(fragment);
		let index = element.dataset.index;
		let dataType = fragment.getData(parentElement.dataset.format)[index];
		let same = dataType === element.textContent;

		console.log(`The dataStructure says "${dataType}" and the element says "${element.textContent}.\n\tAre they the same? ${same}`);

		if (same) {
			console.log('No change to upload');
		}
		else {
			dataType[index] = element.textContent;
			fragment.setData(parentElement.dataset.format,dataType);
			console.log(fragment);
			document.enchiridion.ajax.uploadFragment(fragment, element);
		}
			// let data = e.target.textContent;
			// if (data === '') {
			// 	console.warn('Not posting empty data');
			// 	return;
			// }
			// console.log(e.target.id, e.target.id === 'newParagraph');
			// if (e.target.id === 'newParagraph') {
			// 	console.log('posting', data);
			// 	document.enchiridion.ajax.uploadFragment({'data': data}, e.target);
			// } else {
			// 	console.log('Put');
			// 	document.enchiridion.ajax.updateFragment(
			// 		{
			// 			data: data,
			// 			fId: e.target.id
			// 		},
			// 		e.target
			// 	);
			// }
	}
});
