const Fragment = class{
	constructor(creator){
		this._fragmentName = "";
		this._fragmentId = null;
		this._creator = creator;
		this._createdOn = new Date();
		this._lastChange = this._createdOn;
		this._data = {};
		// this._deltas = ;
	}

	set fragmentName(name){
		this._fragmentName = name;
	}

	get fragmentName(){
		return this._fragmentName;
	}

	set fragmentId(id){
		if(this._fragmentId){
			console.warn('ID already set');
		}
		else{
			this._fragmentId = id;
		}
	}

	get fragmentId(){
		return this._fragmentId;
	}

	get creator(){
		return this._creator;
	}

	get createdOn(){
		return this._createdOn;
	}

	get lastChange(){
		return this._lastChange;
	}

	setData(format, data){
		// touch and infer delta
		let thisFormat = this.getData(format);
		if (thisFormat) {
			console.log('Update');
			thisFormat.data = data;
		} else {
			console.log('New');
			let f = new FragmentData();
			f.data = data;
			this._data[format] = f;
		}
		this._lastChange = new Date();
	};

	getData(format){
		let chosenFormat = this._data[format];
		if (chosenFormat) {
			return chosenFormat;
		} else {
			return null;
		}
	};
};
