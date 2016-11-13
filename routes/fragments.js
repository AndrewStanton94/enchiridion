var express = require('express');
var router = express.Router();

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
	content.fId = fileName;
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

			GLOBAL.search.wrapper.addData(content);
		}
	);
	return fileName;
};

router.post('/', function(req, res) {
	console.log('POST fragments/ req.body:', req.body);
	var fName = aFileWriter(req.body);
	res.status(202).json({
		fragmentState: 'created',
		fragmentId: fName
	});
});

router.search('/', function (req, res) {
	console.log('SEARCH fragments/ Searching for', req.body);
	var ans = GLOBAL.search.wrapper.doSearch(req.body);
	res.json({
		results: ans,
		start: 0,
		len: ans.length
	});
});

module.exports = router;