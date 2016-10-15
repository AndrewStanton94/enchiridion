document.enchiridion.transclusion = {
	data: [
		{
			'type': 'standard',
			'data': 'My hella sublime insights'
		},
		{
			'type': 'nested',
			'data':
			[
				{
					'type': 'standard',
					'data': 'My hella deep insights'
				},
				{
					'type': 'standard',
					'data': 'My alternative hella deep insights'
				}
			]
		}
	],

	createNewTransclusion: e => {
		let preceedingElement = e.target,
			newTransclusion =  document.enchiridion.content.addBlockquote(preceedingElement),
		transclusionRef = prompt('What do you want to transclude?');
		newTransclusion.innerText = transclusionRef;
		newTransclusion.focus();
	},

	createParagraph: e => {
		let preceedingElement, newContent;
		if (e) {
			preceedingElement = e.target;
		}
		newContent =  document.enchiridion.content.addParagraph(preceedingElement);
		newContent.focus();
		return newContent;
	},

	init: () => {
		if (document.enchiridion.transclusion.data) {
			document.enchiridion.transclusion.drawPage();
		} else {
			document.enchiridion.transclusion.createParagraph();
		}
	},

	drawPage: () => {
		document.enchiridion.transclusion.data.map( i => {
			document.enchiridion.transclusion.processFragment(i);
		});
	},

	processFragment: (fragment, container) => {
		console.log(fragment.data);
		let element;
		switch (fragment.type) {
			case 'standard':
				element =  document.enchiridion.transclusion.createParagraph({'taget': container});
				element.innerText = fragment.data;
				break;
			case 'nested':
				let nestContainer = document.enchiridion.transclusion.createParagraph();
				fragment.data.map( childFragment => {
					console.log('Nested under', nestContainer);
					document.enchiridion.transclusion.processFragment(childFragment, nestContainer);
				});
				break;
			default:
				console.warn('Unrecognised fragment type', fragment.type);
		}
		console.log(element);
	}
};
