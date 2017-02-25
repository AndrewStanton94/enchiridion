document.enchiridion = document.enchiridion || {};
document.enchiridion.ajax = {
	fail : e => {console.error(e);},

	uploadFragment:  function(
		data,
		elem,
		serverResponse = json => {
			console.log(json);
			console.log(elem);
			elem.id = json.fragmentId;
			elem.classList.remove('contentChanged');
		}
	) {
		fetch('fragments', {
			method: 'POST',
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
			serverResponse(json, data, elem);
		})
		.catch(function(e) {
			document.enchiridion.ajax.fail(e);
		});
	},

	getFragment:  function(
		data,
		serverResponse = json => {
			console.log(json);
		}
	) {
		fetch(`fragments/${data.fId}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		}).then(function(res) {
			if (res.ok) {
				return res.json();
			}
			else {
				console.log(res.status);
			}
		})
		.then(function(json){
			let obj = JSON.parse(json);
			let fragment = Object.setPrototypeOf(
				obj,
				document.enchiridion.dataStructures.FragmentProto
			);
			let fragmentId = fragment.getFragmentId();
			console.log('Fetching and saving fragment', fragment);
			document.enchiridion.fragments[fragmentId] = fragment;
			return fragment;
		})
		.then(function(fragment){
			serverResponse(fragment);
		})
		.catch(function(e) {
			document.enchiridion.ajax.fail(e);
		});
	},

	search:  function(
		data,
		serverResponse = json => {
			console.log(json);
			document.enchiridion.ajax.render(json);
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
			document.enchiridion.ajax.fail(e);
		});
	},

	render: function (data) {
		const aResult = function (match){
			console.log(`The data '${match.data}' is stored at ${match.fId}`);
		};
		data.results.map( result => aResult(result));
	},

	updateFragment:  function(
		fragment,
		elem,
		serverResponse = json => {
			console.log(json);
			console.log(elem);
			elem.classList.remove('contentChanged');
		}
	) {
		fetch(`fragments/${fragment.getFragmentId()}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(fragment)
		}).then(function(res) {
			if (res.ok) {
				return res.json();
			}
			else {
				console.log(res.status);
			}
		})
		.then(function(json){
			serverResponse(json, fragment, elem);
		})
		.catch(function(e) {
			document.enchiridion.ajax.fail(e);
		});
	}
};
