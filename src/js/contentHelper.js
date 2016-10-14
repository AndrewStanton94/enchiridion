document.enchiridion.content.addBlockquote = () => {
	console.log('Creating a blockquote');
	document.enchiridion.content.appendNewElement(
		document.enchiridion.transclusionContainer,
		'blockquote',
		{
			'contentEditable': 'true',
			'innerText': 'And I quote: wibble',
			'key': 'value'
		}
	);
};
document.enchiridion.content.addParagraph = () => {
	console.log('Creating a paragraph');
	document.enchiridion.content.appendNewElement(
		document.enchiridion.transclusionContainer,
		'p',
		{
			'contentEditable': 'true',
			'innerText': 'Innovative wibble',
			'key': 'value'
		}
	);
};
