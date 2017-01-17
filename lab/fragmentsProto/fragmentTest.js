const test = function () {
	// Create the fragment
	let f = {};
	Object.setPrototypeOf(f, FragmentProto);
	f.constructor('Me');
	// // Author set correctly from constructor
	console.log(`Author: ${f.getCreator()}`);

	// Time of creation
	console.log(`Created on: ${f.getCreatedOn()}`);

	// The ID can be set once
	f.setFragmentId('4269');
	f.setFragmentId('4242');
	console.log(`ID: ${f.getFragmentId()}`);

	// RW fragment title
	f.setFragmentName('Blackadder');
	console.log(`Name: ${f.getFragmentName()}`);

	// Set and replace data
	f.setData('txt/en', 'Beer');
	console.log(`Data: ${f.getData('txt/en').data}`);

	f.setData('txt/en', 'Money');
	f.setData('txt/youtube', 'https://www.youtube.com/watch?v=TkZFuKHXa7w&t=25s');

	// Log the data
	f.getFormats().forEach(format => console.log(
		`Data [${format}]: ${f.getData(format).data}`
	));

	let sf = JSON.stringify(f);
	console.log(sf);
	let rf = JSON.parse(sf);
	Object.setPrototypeOf(rf, FragmentProto);

	console.log(`Author: ${rf.getCreator()}`);
	console.log(`Created on: ${rf.getCreatedOn()}`);
	console.log(`ID: ${rf.getFragmentId()}`);
	console.log(`Name: ${rf.getFragmentName()}`);
	console.log(`Data: ${rf.getData('txt/en').data}`);
	rf.getFormats().forEach(format => console.log(
		`Data [${format}]: ${rf.getData(format).data}`
	));

};

window.addEventListener('load', test);
