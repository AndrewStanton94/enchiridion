window.addEventListener('load', () => {
	// console.log('Page loaded');

	document.enchiridion.transclusionContainer = document.getElementById('transclusionContainer');
	let addFragmentButton = document.getElementById('addNewFragment');

	addFragmentButton.addEventListener('click', document.enchiridion.content.addParagraph);

	document.enchiridion.transclusionContainer.addEventListener('keypress', e => {
		// console.log(e);
		if (e.key === 'Enter') {
			if (e.ctrlKey) {
				console.log('<C-Enter>');
			}
			else if (e.shiftKey) {
				document.enchiridion.content.addBlockquote();
				prompt('What do you want to transclude?');
			}
			else if (e.altKey) {
				console.log('<M-Enter>');
			}
			else {
				document.enchiridion.content.addParagraph();
			}
		}
	});
	document.enchiridion.content.addParagraph();
});
