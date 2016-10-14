document.enchiridion.content.addBlockquote = preceedingElement => {
	console.log('Creating a blockquote');
	let newBlockquote = document.enchiridion.content.createElement(
		'blockquote',
		{
			'contentEditable': 'true',
			'innerText': 'And I quote: wibble',
			'key': 'value'
		}
	);
	document.enchiridion.content.insertElement(newBlockquote, preceedingElement);
	return newBlockquote;
};

document.enchiridion.content.addParagraph = preceedingElement => {
	console.log('Creating a paragraph', preceedingElement);
	let newParagraph = document.enchiridion.content.createElement(
		'p',
		{
			'contentEditable': 'true',
			'innerText': 'Innovative wibble',
			'key': 'value'
		}
	);
	document.enchiridion.content.insertElement(newParagraph, preceedingElement);
	return newParagraph;
};

document.enchiridion.content.insertElement = (element, preceedingElement) => {
	if (preceedingElement && preceedingElement.type !== 'click') {
	// Have a preceedingElement which is not a click event
		preceedingElement.insertAdjacentElement('afterend', element);
	} else {
	// No valid container, so append
		document.enchiridion.transclusionContainer.insertAdjacentElement('beforeend', element);
		console.log('Appending element');
	}
};
