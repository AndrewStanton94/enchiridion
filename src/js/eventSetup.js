window.addEventListener('load', () => {
	document.enchiridion.transclusionContainer = document.getElementById('transclusionContainer');
	let addFragmentButton = document.getElementById('addNewFragment');

	addFragmentButton.addEventListener('click',  () => {
		document.enchiridion.transclusion.createParagraph({
			'container': document.enchiridion.transclusionContainer,
			'innerText': 'Appended from button'
		});} );

	document.enchiridion.transclusionContainer.addEventListener('keypress', e => {
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
					'innerText': 'Write here from <Enter>'
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
			document.enchiridion.ajax.upload({'data': data}, e.target);
		},
		true
	);

	document.enchiridion.transclusion.init();
});
