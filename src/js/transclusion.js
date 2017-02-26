document.enchiridion = document.enchiridion || {};
document.enchiridion.transclusion = {
	create: function(fragment, dataType = '*'){
		return {
			'type': 'transclusion',
			'id': fragment.getFragmentId(),
			'dataType': dataType
		};
	},

	load: function(transclusion, element) {
		console.log('This is a transclusion: ', transclusion);
		element.textContent = `${transclusion.type} of  ${transclusion.id}`;

		document.enchiridion.ajax.getFragment(
			{fId: transclusion.id},
			fragment => {
				document.enchiridion.fragmentLoader.getPlugin([transclusion.dataType], fragment)
				.then(document.enchiridion.fragmentLoader.extractContent)
				.then(document.enchiridion.fragmentLoader.generateElements)
				.then(transferContainer => {
					element.parentElement.replaceChild(
						transferContainer.element,
						element
					);
					return transferContainer;
				})
				.then(document.enchiridion.fragmentLoader.addFragmentGenerationElement);
			}
		);
	}
};
