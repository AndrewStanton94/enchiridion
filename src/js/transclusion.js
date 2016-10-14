document.enchiridion.transclusion = {
	createNewTransclusion: e => {
		let preceedingElement = e.target,
			newTransclusion =  document.enchiridion.content.addBlockquote(preceedingElement),
		transclusionRef = prompt('What do you want to transclude?');
		newTransclusion.innerText = transclusionRef;
		newTransclusion.focus();
	},

	createParagraph: e => {
		let preceedingElement, newContent;
		if (e) {
			preceedingElement = e.target;
		}
		newContent =  document.enchiridion.content.addParagraph(preceedingElement);
		newContent.focus();
	}
};
