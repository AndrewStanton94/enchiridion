module.exports = {
	// Connection URL
	url: 'mongodb://localhost:27017/enchiridion',

	create: function(data, callback){
		console.log('Giving mongo this data: ', data);
		var MongoClient = require('mongodb').MongoClient;
		// Use connect method to connect to the server
		MongoClient.connect(this.url, function(err, db) {
			module.exports.insertDocuments(db, data, function(result){
				callback(result);
				db.close();
			});
		});
	},

	search: function(keyword, callback){
		module.exports.get(
			{"_data.text/plain::eng": {$regex: keyword}},
			callback
		);
	},

	get: function(query, callback){
		var MongoClient = require('mongodb').MongoClient;
		// Use connect method to connect to the server
		MongoClient.connect(this.url, function(err, db) {
			module.exports.findDocuments(
				db,
				query,
				function(docs) {
					callback(docs);
					db.close();
				}
			);
		});
	},

	update: function(id, replacement, callback){
		var MongoClient = require('mongodb').MongoClient;
		// Use connect method to connect to the server
		MongoClient.connect(this.url, function(err, db) {
			module.exports.updateDocument(db, id, replacement, function() {
				callback();
				db.close();
			});
		});
	},

	connect: function(){
		var MongoClient = require('mongodb').MongoClient,
			assert = require('assert');
		// Use connect method to connect to the server
		MongoClient.connect(this.url, function(err, db) {
			if(err){
				console.error('Is the service on?');
			}
			assert.equal(null, err);
			console.log("Connected successfully to server");
			db.close();
		});
	},

	insertDocuments: function(db, data, callback) {
		db.collection('documents').insertOne(
			data,
			function(err, result) {
				console.log("Inserted a document into the collection", result);
				callback(result);
			}
		);
	},

	findDocuments: function(db, query, callback) {
		db.collection('documents').find(query).toArray(
			function(err, docs) {
				console.log("Found the following records");
				console.log(docs)
				callback(docs);
			}
		);
	},

	updateDocument: function(db, id, replacement, callback) {
		db.collection('documents').replaceOne(
			{ _id : id },
			replacement,
			function(err, result) {
				console.log("Updated fragment: ", id);
				callback(result);
			}
		);
	}
};
