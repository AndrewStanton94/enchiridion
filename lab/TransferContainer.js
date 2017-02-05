document.enchiridion = document.enchiridion || {};
document.enchiridion.dataStructures = document.enchiridion.dataStructures || {};
document.enchiridion.dataStructures.TransferContainer = class{
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
};
