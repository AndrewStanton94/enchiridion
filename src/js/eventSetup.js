window.addEventListener('load', () => {
	document.enchiridion.transclusionContainer = document.getElementById('transclusionContainer');
	let addFragmentButton = document.getElementById('addNewFragment');

	addFragmentButton.addEventListener('click',  () => {
		document.enchiridion.transclusion.createParagraph({
			'container': document.enchiridion.transclusionContainer,
			'innerText': 'Appended from button',
			id: 'newParagraph',
			focus: true
		});} );

	document.enchiridion.transclusionContainer.addEventListener('keypress', e => {
		e.target.classList.add('contentChanged');
		if (e.key === 'Enter') {
			e.preventDefault();
			console.log(e);
			if (e.ctrlKey) {
				console.log('<C-Enter>');
			}
			else if (e.shiftKey) {
				document.enchiridion.transclusion.createNewTransclusion({
					'placeAfter': e.target
				});
			}
			else if (e.altKey) {
				console.log('<M-Enter>');
			}
			else {
				document.enchiridion.transclusion.createParagraph({
					'placeAfter': e.target,
					'innerText': 'Write here from <Enter>',
					id: 'newParagraph',
					focus: true
				});
			}
		}
	});

	document.enchiridion.transclusionContainer.addEventListener(
		'blur',
		e => {
			let data = e.target.textContent;
			if (data === '') {
				console.warn('Not posting empty data');
				return;
			}
			console.log(e.target.id, e.target.id === 'newParagraph');
			if (e.target.id === 'newParagraph') {
				console.log('posting', data);
				document.enchiridion.ajax.uploadFragment({'data': data}, e.target);
			} else {
				console.log('Put');
				document.enchiridion.ajax.updateFragment(
					{
						data: data,
						fId: e.target.id
					},
					e.target
				);
			}
		},
		true
	);

	document.getElementById('searchBox').addEventListener('input', e => {
		console.log(e.target.value);
		let searchResults = document.getElementById('searchResults');
		searchResults.innerHTML = '';
		document.enchiridion.ajax.search({q: e.target.value}, json => {
			json.results.map(match => {
				console.log('A match', match);
				document.enchiridion.transclusion.createParagraph({
					container: searchResults,
					innerText: match.data,
					id: match.fId
				});
			});
		});
	});

	document.enchiridion.transclusion.init();
});
