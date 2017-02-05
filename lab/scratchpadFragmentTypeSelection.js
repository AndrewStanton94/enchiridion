const config = {
	preferredFormats: [ 'txt', 'gif' ],
	preferredLanguages: [ 'en' ]
},

test = function(){
	let f1 = {};
	let f1_1 = {};
	let f2 = {};
	let f3 = {};
	document.fragments = [f1, f2, f3, f1_1];
	let topLevelFragments = [f1, f2, f3];

	document.fragments.map(f => {
		Object.setPrototypeOf(f, FragmentProto);
		f.constructor('Me');
	});

	f1_1.setFragmentId('27op4qr4-1175');
	f1_1.setData('txt/gr', 'Και εδώ είναι κάποιο κείμενο');

	f1.setFragmentId('27bc4de4');
	f1.setData('txt/en', 'And here is some text');
	f1.setData('gif/en', 'https://unused.url.png');
	f1.setData('txt/gr', f1_1);

	f2.setFragmentId('28bc4de4');
	f2.setData('txt/en', 'And here\'s some different text');
	f2.setData('png/en', 'https://a.url.png');

	f3.setFragmentId('29bc4de4');
	f3.setData('gif/en', 'http://media.tumblr.com/tumblr_mco8geSmzK1r3a4b6.gif');

	topLevelFragments.map(document.enchiridion.fragmentLoader.processFragment);
};

window.addEventListener('load', test);
