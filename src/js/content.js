document.enchiridion = document.enchiridion || {};
document.enchiridion.content = {
	createElement: (elementName, data) => {
		let newElement = document.createElement(elementName);
		document.enchiridion.content.setAttributes(newElement, data);
		return newElement;
	},

	setAttributes : (element, data) => {
		Object.keys(data).map( key => {
			let value = data[key];
			if (key === 'innerText'){
				element.innerText = value;
			}
			else {
				// console.log(`Setting ${key} : ${value} for ${element}`);
				element.setAttribute(key, value);
			}
		});
	}
};
