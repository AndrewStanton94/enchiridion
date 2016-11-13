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

	search:  function(
		data,
		success = () => {console.log('I searched');},
		serverResponse = json => {
			console.log(json);
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
	}
};
