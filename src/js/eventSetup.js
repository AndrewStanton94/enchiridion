'use strict';
window.addEventListener('load', () => {
	console.log('Page loaded');

	let transclusionContainer = document.getElementById('transclusionContainer'),
		addFragmentButton = document.getElementById('addNewFragment');

	console.log(addFragmentButton);

	addFragmentButton.addEventListener('click', e => 
	{
		document.enchiridion.content.appendNewElement(
			transclusionContainer,
			'blockquote',
			{
				'contentEditable': 'true',
				'innerText': 'wibble',
				'key': 'value'
			}
		);
	});
});
