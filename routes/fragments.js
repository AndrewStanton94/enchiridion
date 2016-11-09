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
		}
	);
};

var aFileWriter = function (content, fileName) {
	fileName = fileName || require('node-uuid').v4();
	var fs = require('fs');
	var writeSource = `fragments/${fileName}.json`;
	fs.writeFile(writeSource,
		content,
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

router.post('/', function(req, res) {
	console.log(req.body);
	var fName = aFileWriter(JSON.stringify(req.body));
	console.log(fName);
	res.status(202).json({
		fragmentState: 'created',
		fragmentId: fName
	});
});

module.exports = router;
