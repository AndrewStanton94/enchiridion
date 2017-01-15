const FragmentData = class {
	constructor(dataType, language){
		this._dataType = dataType;
		this._language = language;
		this._data;
		this._meta;
		// this._schema;
		// this._altPlugin;
	}

	get format(){
		return {
			'dataType': this._dataType,
			'language': this._language
		}
	}

	set data(theData){
		this._data = theData;
	}

	get data(){
		return this._data;
	}
};
