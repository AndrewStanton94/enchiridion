document.enchiridion = document.enchiridion || {};
document.enchiridion.fragments = document.enchiridion.fragments || {};
document.enchiridion.fragmentManager = {
	save: function(fragment, id = fragment.getFragmentId()){
		console.log('Saving fragment', fragment);
		document.enchiridion.fragments[id] = fragment;
		document.enchiridion.fragmentManager.drawRecent();
	},

	get: function(id){
		let fragment = document.enchiridion.fragments[id];
		if (fragment) {
			return fragment;
		}
		else {
			console.warn('We don\'t have the fragment id:', id);
		}
	},

	drawRecent: function(){
		let recent = document.getElementById('recentFragments');
		recent.innerHTML = '<h1>Recent Fragments</h1>';
		let fragments = document.enchiridion.fragments;

		Object.keys(fragments).forEach(name => {
			document.enchiridion.fragmentLoader.processRecentFragments(fragments[name]);
		});
	}
};
