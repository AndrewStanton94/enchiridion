const FragmentData = class {
	constructor(language, dataType){
		this._language = language;
		this._dataType = dataType;
		this._data;
		this._meta;
		// this._schema;
		// this._altPlugin;
	}

	get format(){
		return {
			'language': this._language,
			'dataType': this._dataType
		}
	}

	set data(theData){
		this._data = theData;
	}

	get data(){
		return this._data;
	}
};
