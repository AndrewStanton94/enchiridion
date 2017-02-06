document.enchiridion.transclusion = {
	createNewTransclusion: params => {
		params.innerText = params.innerText ? params.innerText : prompt('What do you want to transclude?');
		let newTransclusion = document.enchiridion.content.createElement('blockquote', {
			'contentEditable': 'true',
			'innerText': `Fetching ${params.innerText}`
		});
		if (params.container) {
			params.container.insertAdjacentElement('beforeend', newTransclusion);
		}
		if (params.placeAfter) {
			params.placeAfter.insertAdjacentElement('afterend', newTransclusion);
		}
		newTransclusion.focus();
		return newTransclusion;
	},

	createNewParallel: params => {
		let newParallel = document.enchiridion.content.createElement('section', {
			'contentEditable': 'true',
			'class': 'parallel'
			// 'innerText': 'Building subtree'
		});
		if (params.container) {
			params.container.insertAdjacentElement('beforeend', newParallel);
		}
		if (params.placeAfter) {
			params.placeAfter.insertAdjacentElement('afterend', newParallel);
		}
		newParallel.focus();
		return newParallel;
	},

	createParagraph: params => {
		let newContent = document.enchiridion.content.createElement(
			'p',
			{
				'contentEditable': 'true',
				'innerText': params.innerText,
				'id': params.id
			}
		);
		if (params.container) {
			params.container.insertAdjacentElement('beforeend', newContent);
		}
		if (params.placeAfter) {
			params.placeAfter.insertAdjacentElement('afterend', newContent);
		}
		if (params.focus) {
			newContent.focus();
		}
		return newContent;
	},

	init: () => {
		if (document.enchiridion.transclusion.data) {
			document.enchiridion.transclusion.drawPage();
		} else {
			document.enchiridion.transclusion.createParagraph({
				container: document.enchiridion.transclusionContainer,
				innerText: '',
				id: 'newParagraph',
				focus: true
			});
		}
	},

	drawPage: () => {
		document.enchiridion.transclusion.data.map( fragment => {
			document.enchiridion.transclusion.processFragment(fragment, document.enchiridion.transclusionContainer);
		});
	},

	processFragment: (fragment, container) => {
		let element;
		switch (fragment.type) {
			case 'standard':
				element = document.enchiridion.transclusion.createParagraph({
					'container': container,
					'innerText': fragment.data
				});
				break;
			case 'transclusion':
				element = document.enchiridion.transclusion.createNewTransclusion({
					'container': container,
					'innerText': fragment.data
				});
				break;
			case 'parallel':
				// Create container
				element = document.enchiridion.transclusion.createNewParallel({
					'container': container
				});
				// processFragment for decendants
				fragment.data.map(i => {
					console.log('[processFragment] Parallel data', i.data);
					document.enchiridion.transclusion.processFragment(i, element);
				});
				break;
			default:
				console.warn('[processFragment] Unrecognised fragment type', fragment.type);
		}
	}
};
