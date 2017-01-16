const TransferContainer = class{
	constructor(fragment, plugins, formatsToRender){
		this._fragment = fragment;
		this._plugins = plugins;
		this._formatsToRender = formatsToRender;
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
},

config = {
	preferredFormats: [ 'txt', 'gif' ],
	preferredLanguages: [ 'en' ]
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
	let renderType = fragment.formats;
	if(renderType.length > 1){
		renderType = filterFormats(renderType, 1, config.preferredLanguages);
		console.log('After language filter: ', renderType);
	}
	if(renderType.length > 1){
		renderType = filterFormats(renderType, 0, config.preferredFormats);
		console.log('After type filter: ', renderType);
	}
	console.log(renderType);
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

generateElements = transferContainer =>
	transferContainer.plugins.main(transferContainer),

draw = function(content){
	document.getElementsByTagName('main')[0].insertAdjacentHTML(
		'beforeend',
		content
	);
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
	let f1 = new Fragment();
	let f1_1 = new Fragment();
	let f2 = new Fragment();
	let f3 = new Fragment();

	f1_1.fragmentId = '27op4qr4-1175-4766-8429-950rpq802n87';
	f1_1.setData('txt/gr', 'Και εδώ είναι κάποιο κείμενο');

	f1.fragmentId = '27bc4de4-1175-4766-8429-950ecd802a87';
	f1.setData('txt/en', 'And here is some text');
	f1.setData('gif/en', 'https://unused.url.png');
	f1.setData('txt/gr', f1_1);

	f2.fragmentId = '27bc4de4-1175-4766-8429-950ecd802a87';
	f2.setData('txt/en', 'And here\'s some different text');
	f2.setData('png/en', 'https://a.url.png');

	f3.fragmentId = '27bc4de4-1175-4766-8429-950ecd802a87';
	f3.setData('gif/en', 'http://media.tumblr.com/tumblr_mco8geSmzK1r3a4b6.gif');

	let fragments = [f1, f2, f3];
	fragments.map(processFragment);
};

window.addEventListener('load', test);
