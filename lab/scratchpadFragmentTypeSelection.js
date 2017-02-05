document.enchiridion = document.enchiridion || {};
document.enchiridion.config = {
	preferredFormats: [ 'text/plain', 'image/gif' ],
	preferredLanguages: [ 'eng' ]
};

const test = function(){
	let f1 = {};
	let f1_1 = {};
	let f2 = {};
	let f3 = {};
	document.fragments = [f1, f2, f3, f1_1];
	let topLevelFragments = [f1, f2, f3];

	document.fragments.map(f => {
		Object.setPrototypeOf(f, document.enchiridion.dataStructures.FragmentProto);
		f.constructor('Me');
	});

	f1_1.setFragmentId('27op4qr4-1175');
	f1_1.setData('text/plain::grc', 'Και εδώ είναι κάποιο κείμενο');

	f1.setFragmentId('27bc4de4');
	f1.setData('text/plain::eng', 'And here is some text');
	f1.setData('gif::eng', 'https://unused.url.png');
	f1.setData('text/plain::grc', f1_1);

	f2.setFragmentId('28bc4de4');
	f2.setData('text/plain::eng', 'And here\'s some different text');
	f2.setData('image/png::eng', 'https://a.url.png');

	f3.setFragmentId('29bc4de4');
	f3.setData('image/gif::eng', 'http://media.tumblr.com/tumblr_mco8geSmzK1r3a4b6.gif');

	topLevelFragments.map(document.enchiridion.fragmentLoader.processFragment);
};

window.addEventListener('load', test);
