const FragmentProto = {
	constructor: function(creator){
		this._fragmentName = '';
		this._fragmentId = null;
		this._creator = creator;
		this._createdOn = new Date();
		this._lastChange = this._createdOn;
		this._data = {};
		// this._deltas = ;
	},

	setFragmentName: function(name){
		this._fragmentName = name;
	},

	getFragmentName: function(){
		return this._fragmentName;
	},

	setFragmentId: function(id){
		if(this._fragmentId){
			console.warn('ID already set');
		}
		else{
			this._fragmentId = id;
		}
	},

	getFragmentId: function(){
		return this._fragmentId;
	},

	getCreator: function(){
		return this._creator;
	},

	getCreatedOn: function(){
		return this._createdOn;
	},

	getLastChange: function(){
		return this._lastChange;
	},

	getFormats: function(){
		return Object.keys(this._data);
	},

	setData: function(format, data){
		// touch and infer delta
		let thisFormat = this.getData(format);
		if (thisFormat) {
			thisFormat.data = data;
		}
		else {
			let f = {};
			f.data = data;
			this._data[format] = f;
		}
		this._lastChange = new Date();
	},

	getData: function(format){
		let chosenFormat = this._data[format];
		if (chosenFormat) {
			return chosenFormat;
		} else {
			return null;
		}
	}
};
