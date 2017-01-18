const TransferContainer = class{
	constructor(fragment, plugins, formatsToRender){
		this._fragment = fragment;
		this._plugins = plugins;
		this._formatsToRender = formatsToRender;
		this._element;
	}

	set data(recievedData){
		this._data = recievedData;
	}

	get data(){
		return this._data;
	}

	get plugins(){
		return this._plugins;
	}

	get formatToRender(){
		return this._formatsToRender[0];
	}

	get fragment(){
		return this._fragment;
	}

	get element(){
		return this._element;
	}

	set element(elem){
		this._element = elem;
	}
},

config = {
	preferredFormats: [ 'txt', 'gif' ],
	preferredLanguages: [ 'en' ]
},

retrieveFragment = function(id, fragments){
	let matchesId = f => f.getFragmentId() === id;
	let fragment = fragments.find(matchesId);
	return fragment;
},

// like python `in`
inCollection = function(item, collection){
	return collection.indexOf(item) >= 0;
},

filterFormats = function(list, sliceIndex, validOptions){
	return list.filter(function(key){
		return inCollection(key.split('/')[sliceIndex], validOptions);
	});
},

selectFormat = function(fragment){
	let renderType = fragment.getFormats();
	if(renderType.length > 1){
		renderType = filterFormats(renderType, 1, config.preferredLanguages);
		console.log('After language filter: ', renderType);
	}
	if(renderType.length > 1){
		renderType = filterFormats(renderType, 0, config.preferredFormats);
		console.log('After type filter: ', renderType);
	}
	return renderType;
},

// A promise that will do the plugin lookup
getPlugin = function(formatToRender, fragment){
	return new Promise(function(resolve, reject){
		document.enchiridion = document.enchiridion || {};
		document.enchiridion.plugins = document.enchiridion.plugins || {};
		let fileType = formatToRender[0].split('/')[0];

		let plugin = document.enchiridion.plugins[fileType];
		if(plugin){
			resolve(new TransferContainer(fragment, plugin, formatToRender));
		}
		else{
			require([fileType], plugin => {
				document.enchiridion.plugins[fileType] = plugin;
				resolve(new TransferContainer(fragment, plugin, formatToRender));
			});
		}
	});
},

extractContent = function(transferContainer){
	transferContainer.data = transferContainer.plugins.data(transferContainer);
	return transferContainer;
},

generateElements = transferContainer => {
	transferContainer.element = transferContainer.plugins.main(transferContainer);
	return transferContainer;
},

draw = function(transferContainer){
	let content = transferContainer.element;
	content.draggable = true;
	content.id = transferContainer.fragment.getFragmentId();
	content.dataset.format = transferContainer.formatToRender;
	document.getElementsByTagName('main')[0].insertBefore(content, null);
},

// Get plugin, then use the data one and pass it to a renderer
processFragment = function(fragment) {
	let formatToRender = selectFormat(fragment);
	getPlugin(formatToRender, fragment)
	.then(extractContent)
	.then(generateElements)
	.then(draw);
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

	topLevelFragments.map(processFragment);
};

window.addEventListener('load', test);
