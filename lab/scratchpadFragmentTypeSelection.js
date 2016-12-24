const TransferContainer = class{
	constructor(fragment, plugins, formatsToRender){
		this._fragment = fragment;
		this._plugins = plugins;
		this._formatsToRender = formatsToRender
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

fragments = [
	{
		'data': {
			'txt/en': 'And here is some text',
			'txt/gr': {
				'data': {
					'txt/en': 'And here is some text'
				},
				'fId': '27op4qr4-1175-4766-8429-950rpq802n87'
			}
		},
		'fId': '27bc4de4-1175-4766-8429-950ecd802a87'
	},
	{
		'data': {
			'txt/en': 'And here\'s some different text',
			'txt/gr': {
				'data': {
					'txt/en': 'And here is some text'
				},
				'fId': '27op4qr4-1175-4766-8429-950rpq802n87'
			}
		},
		'fId': '27bc4de4-1175-4766-8429-950ecd802a87'
	},
	{
		'data': {
			'gif/en': 'http://media.tumblr.com/tumblr_mco8geSmzK1r3a4b6.gif',
			'txt/gr': {
				'data': {
					'txt/en': 'And here is some text'
				},
				'fId': '27op4qr4-1175-4766-8429-950rpq802n87'
			}
		},
		'fId': '27bc4de4-1175-4766-8429-950ecd802a87'
	}
],
config = {
	preferredFormats: [ 'txt', 'gif' ],
	preferredLanguages: [ 'en' ]
},

// like python `in`
inCollection = function(item, collection){
	return collection.indexOf(item) >= 0;
},

// Get a fragment with both language and type being in preferred lists
strictFilter = function(key) {
	parts = key.split('/');
	return inCollection(parts[0], config.preferredFormats)
		&& inCollection(parts[1], config.preferredLanguages);
},

fileTypeFilter = function(key) {
	parts = key.split('/');
	console.log(parts);
	return inCollection(parts[0], config.preferredFormats);
},

selectFormat = function(fragment){
	var renderType = Object.keys(fragment.data);
	if(renderType.length > 1){
		renderType = renderType.filter(fileTypeFilter);
	}
	console.log(renderType);
	return renderType[0];
},

// A promise that will do the plugin lookup
getPlugin = function(formatToRender, fragment){
	return new Promise(function(resolve, reject){
		document.enchiridion = document.enchiridion || {};
		document.enchiridion.plugins = document.enchiridion.plugins || {};
		var fileType = formatToRender[0].split('/')[0];

		var plugin = document.enchiridion.plugins[fileType];
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
	transferContainer.plugins.main(transferContainer)
,

draw = function(content){
	document.getElementsByTagName('main')[0].insertAdjacentHTML(
		'beforeend',
		content
	);
},

// Get plugin, then use the data one and pass it to a renderer
processFragment = function(fragment) {
	var formatToRender = selectFormat(fragment);
	getPlugin(formatToRender, fragment)
	.then(extractContent)
	.then(generateElements)
	.then(draw);
};

test = function(){
	fragments.map(processFragment);
};

window.addEventListener('load', test);
