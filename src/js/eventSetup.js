window.addEventListener('load', () => {
	// console.log('Page loaded');

	document.enchiridion.transclusionContainer = document.getElementById('transclusionContainer');
	let addFragmentButton = document.getElementById('addNewFragment');

	addFragmentButton.addEventListener('click', document.enchiridion.content.addParagraph);

	document.enchiridion.transclusionContainer.addEventListener('keypress', e => {
		if (e.key === 'Enter') {
			e.preventDefault();
			console.log(e);
			if (e.ctrlKey) {
				console.log('<C-Enter>');
			}
			else if (e.shiftKey) {
				document.enchiridion.transclusion.createNewTransclusion(e);
			}
			else if (e.altKey) {
				console.log('<M-Enter>');
			}
			else {
				document.enchiridion.transclusion.createParagraph(e.target);
			}
		}
	});

	document.enchiridion.transclusionContainer.addEventListener('focus', e => {
		console.log('Focus', e);
	});
	document.enchiridion.transclusion.createParagraph();
});
