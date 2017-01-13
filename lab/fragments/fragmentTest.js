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

	f.setData('en/txt', 'Gold');
	console.log(`Data: ${f.getData('en/txt').data}`);

	f.setData('en/txt', 'Beer');
	console.log(`Data: ${f.getData('en/txt').data}`);


};

window.addEventListener('load', test);
