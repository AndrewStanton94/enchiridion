var express = require('express');
var router = express.Router();

var aFileWriter = function (content) {
	var uuid = require('node-uuid');
	var fs = require('fs');

	var uuid = uuid.v4();
	var writeSource = `fragments/${uuid}.json`;
	fs.writeFile(writeSource,
		content,
		{'encoding':'utf8'},
		function(err){
			if ( err ) { throw err; }
			console.log('*** File written successfully');
			//Now reading the same file to confirm data written
			fs.readFile(writeSource,
				'utf8',
				function(err, data){
					if ( err ){ throw err;}
					console.log('*** Reading just written file');
					console.log(data);
				}
			);
		}
	);
	return uuid;
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
