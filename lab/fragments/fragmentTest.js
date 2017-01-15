const test = function () {
	// Create the fragment
	let f = new Fragment('me');
	// Author set correctly from constructor
	console.log(`Author: ${f.creator}`)

	// Time of creation
	console.log(`Created on: ${f.createdOn}`)

	// The ID can be set once
	f.fragmentId = '4269';
	f.fragmentId = '4242';
	console.log(`ID: ${f.fragmentId}`);

	// RW fragment title
	f.fragmentName = 'Blackadder';
	console.log(`Name: ${f.fragmentName}`);

	// Set and replace data
	f.setData('txt/en', 'Beer');
	console.log(`Data: ${f.getData('txt/en').data}`);

	f.setData('txt/en', 'Money');
	f.setData('txt/youtube', 'https://www.youtube.com/watch?v=TkZFuKHXa7w&t=25s');

	// Log the data
	f.formats.forEach(format => console.log(
		`Data [${format}]: ${f.getData(format).data}`
	));
};

window.addEventListener('load', test);
