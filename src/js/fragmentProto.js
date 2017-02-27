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
		return this;
	},

	setFragmentName: function(name){
		this._name = name;
		return this;
	},

	getFragmentName: function(){
		return this._name;
	},

	setFragmentId: function(id){
		if(this._id){
			console.warn('ID already set');
		}
		else{
			this._id = id;
		}
		return this;
	},

	getFragmentId: function(){
		return this._id;
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

	setData: function(dataType, data){
		// touch and infer delta
		let thisFormat = this.getData(dataType);
		if (thisFormat) {
			console.log(`Updating entry for ${dataType}: `, data);
		}
		else {
			console.log(`Creating entry for ${dataType}: `, data);
		}
		this._data[dataType] = data;
		return this;
	},

	getData: function(dataType){
		let chosenFormat = this._data[dataType];
		if (chosenFormat) {
			return chosenFormat;
		} else {
			return [];
		}
	},

	spliceData: function(dataType, index, toAdd){
		let data = this.getData(dataType);
		console.log('Pre splice: ', data);
		data.splice(index, 0, toAdd);
		console.log('Post splice: ', data);
		this.setData(dataType, data);
	}
};
