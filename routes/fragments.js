var express = require('express');
var router = express.Router();
var mongo = require('../src/node/mongo');

var aFileReader = function(fileName){
	var fs = require('fs');
	fs.readFile(fileName,
		'utf8',
		function(err, data){
			if(err){
				throw err;
			}
			console.log('*** Reading just written file');
			console.log(data);
			return data;
		}
	);
};

var aFileWriter = function (content, fileName) {
	fileName = fileName || require('node-uuid').v4();
	var fs = require('fs');
	content._id = fileName;
	var writeSource = `fragments/${fileName}.json`;
	fs.writeFile(writeSource,
		JSON.stringify(content),
		{'encoding':'utf8'},
		function(err){
			if(err){
				throw err;
			}
			console.log('*** File written successfully');
			aFileReader(writeSource);
		}
	);
	return fileName;
};

router.get('/:id', function (req, res) {
	console.log(`fragment id ${req.params.id}`);

	mongo.get(
		{_id: req.params.id},
		function(data){
			console.log(data);
			res.json(data);
		}
	);
});

router.post('/', function(req, res) {
	let data = req.body;
	console.log('POST fragments/ req.body:', data);
	var fName = aFileWriter(data);
	data._id = fName;
	mongo.create(
		data,
		function(result){
			console.log(result);
			res.status(201).json({
				fragmentState: 'created',
				fragmentId: fName
			});
		}
	);
});

router.search('/', function (req, res) {
	console.log('SEARCH fragments/ Searching for', req.body);

	mongo.search(req.body.q,
		function(ans){
			res.json({
				results: ans,
				start: 0,
				len: ans.length
			});
		}
	);
});

router.put('/:id', function (req, res) {
	var fName = req.params.id;
	console.log(fName);
	console.log('PUT fragments/ req.body:', req.body);

	aFileWriter(req.body, fName);
	mongo.update(
		fName,
		req.body,
		function(){
			res.status(200).json({
				fragmentState: 'updated',
				fragmentId: fName
			});
	});
});

module.exports = router;
