document.enchiridion = document.enchiridion || {};
document.enchiridion.transclusion = {
	load: function(transclusion, element) {
		console.log('This is a transclusion: ', transclusion);
		element.textContent = `${transclusion.type} of  ${transclusion.id}`;

		document.enchiridion.ajax.getFragment(
			{fId: transclusion.id},
			json => {
				let obj = JSON.parse(json);
				let fragment = Object.setPrototypeOf(obj, document.enchiridion.dataStructures.FragmentProto);
				let data = fragment.getData(transclusion.dataType);
				console.log(data);

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
	},

	test: function () {
		let transclusion = {'type':'transclusion','id':'8958edae-57ca-486f-8eff-3dcda5a021c1','dataType':'text/plain::eng'};

		document.enchiridion.transclusion.load(transclusion, {});
	}
};
