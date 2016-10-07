document.enchiridion = document.enchiridion || {};
document.enchiridion.content = {
	createElement: (elementName, data) => {
		let newElement = document.createElement(elementName);
		document.enchiridion.content.setAttributes(newElement, data);
		return newElement.outerHTML;
	},

	setAttributes : (element, data) => {
		Object.keys(data).map( key => {
			let value = data[key];
			if (key === 'innerText'){
				element.innerText = value;
			}
			else {
				console.log(key)
				console.log(value)
				console.log(element);
				element.setAttribute(key, value);
			}
		});
	},

	appendElement : (preceeding, element) => {
		preceeding.insertAdjacentHTML('beforeend', element);
	},

	appendNewElement : (preceeding, element, data) => {
		document.enchiridion.content.appendElement(preceeding,
			document.enchiridion.content.createElement(element, data)
		);
	}
};
