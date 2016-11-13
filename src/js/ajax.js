document.enchiridion = document.enchiridion || {};
document.enchiridion.ajax = {
	uploadFragment:  function(
		data,
		elem,
		success = () => {console.log('It worked');},
		serverResponse = json => {
			console.log(json);
			console.log(elem);
			elem.id = json.fragmentId;
		},
		fail = e => {console.error(e);}
	) {
		fetch('fragments', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		}).then(function(res) {
			if (res.ok) {
				success();
				return res.json();
			}
			else {
				console.log(res.status);
			}
		})
		.then(function(json){
			serverResponse(json);
		})
		.catch(function(e) {
			fail(e);
		});
	},

	getFragment:  function(
		data,
		success = () => {console.log('Got it');},
		serverResponse = json => {
			console.log(json);
		},
		fail = e => {console.error(e);}
	) {
		fetch(`fragments/${data.fId}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		}).then(function(res) {
			if (res.ok) {
				success();
				return res.json();
			}
			else {
				console.log(res.status);
			}
		})
		.then(function(json){
			serverResponse(json);
		})
		.catch(function(e) {
			fail(e);
		});
	},

	search:  function(
		data,
		serverResponse = json => {
			console.log(json);
			document.enchiridion.ajax.render(json);
		},
		fail = e => {
			console.error(e);
		}
	)
	{
		fetch('fragments', {
			method: 'SEARCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		}).then(function(res) {
			if (res.ok) {
				return res.json();
			}
			else {
				console.log(res.status);
			}
		})
		.then(function(json){
			serverResponse(json);
		})
		.catch(function(e) {
			fail(e);
		});
	},

	render: function (data) {
		const aResult = function (match){
			console.log(`The data '${match.data}' is stored at ${match.fId}`);
		};
		data.results.map( result => aResult(result));
	}
};
