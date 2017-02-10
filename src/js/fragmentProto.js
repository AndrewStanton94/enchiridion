document.enchiridion = document.enchiridion || {};
document.enchiridion.dataStructures = document.enchiridion.dataStructures || {};
document.enchiridion.dataStructures.FragmentProto = {
	constructor: function(creator, baseFragment = null){
		this._name = '';
		this._id = null;
		this._creator = creator;
		this._data = {};
		this._deltas = [];
		this._baseFragment = baseFragment;
		this._stretchDepth = 0;
	},

	setFragmentName: function(name){
		this._fragmentName = name;
	},

	getFragmentName: function(){
		return this._fragmentName;
	},

	setFragmentId: function(id){
		if(this._id){
			console.warn('ID already set');
		}
		else{
			this._id = id;
		}
	},

	getFragmentId: function(){
		return this._fragmentId;
	},

	getCreator: function(){
		return this._creator;
	},

	getDeltas: function(){
		return this._deltas;
	},

	getBaseFragment: function(){
		return this._baseFragment;
	},

	getStretchDepth: function(){
		return this._stretchDepth;
	},

	getFormats: function(){
		return Object.keys(this._data);
	},

	setData: function(format, data){
		// touch and infer delta
		let thisFormat = this.getData(format);
		if (thisFormat) {
			console.log(`Updating entry for ${format}: "${data}"`);
		}
		else {
			console.log(`Creating entry for ${format}: ${data}`);
		}
		this._data[format] = data;
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
