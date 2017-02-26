document.enchiridion.fragments = document.enchiridion.fragments || {};
document.enchiridion.dnd = {
	prepSearch: function () {
		let searchResults = document.getElementById('searchResults');

		searchResults.addEventListener('dragstart', function(e){
			console.log('dragstart e: ', e);
			e.dataTransfer.setData('text/plain', e.target.id);
			e.dataTransfer.setData('format', e.target.dataset.format);

			[... document.enchiridion.transclusionContainer.querySelectorAll('section>.fragment')]
			.forEach((elem) => {
				document.enchiridion.dnd.produceAPlaceholder(elem);
			});
		});

		document.enchiridion.transclusionContainer.addEventListener('drop', e =>{
			console.log('drop: ', e);
			e.preventDefault();
			let droppedOnElem = e.target;
			if (droppedOnElem.classList.contains('placeholder')) {
				let parentElement = droppedOnElem.parentElement;
				let dataType = parentElement.dataset.dataType;
				let containerFragment = document.enchiridion.fragments[parentElement.id];

				let idToAdd = e.dataTransfer.getData('text/plain');
				let fragment = document.enchiridion.fragments[idToAdd];

				let after = droppedOnElem.dataset.afterElem;

				let insertIndex = 0;
				let siblings = [...parentElement.querySelectorAll('.fragment')];
				if (after){
					// May break things if nested multiple layers
					console.log('siblings: ', siblings);
					insertIndex = 1 + siblings.findIndex(elem => {
						return after === elem.id;
					});
				}

				containerFragment.spliceData(
					dataType,
					insertIndex,
					document.enchiridion.transclusion.create(fragment, dataType)
				);
				document.enchiridion.ajax.updateFragment(containerFragment, null, x => {console.log(x);});
			}
			else {
				console.warn('Not a valid drop target');
			}
		});

		document.enchiridion.transclusionContainer.addEventListener('dragend', e =>{
			console.log('dragend: ', e);
			e.preventDefault();
		});

		document.enchiridion.transclusionContainer.addEventListener('dragover', e =>{
			e.preventDefault();
		});
	},

	afterAPlaceholder: function(element){
		if (element.previousElementSibling){
			return element.previousElementSibling.classList.contains('placeholder');
		}
		else {
			return false;
		}
	},

	beforeAPlaceholder: function(element){
		if (element.nextElementSibling){
			return element.nextElementSibling.classList.contains('placeholder');
		}
		else {
			return false;
		}
	},

	produceAPlaceholder: function(elem){
		let parentElement = elem.parentElement,
			nextElementSibling = elem.nextElementSibling;

		if(!document.enchiridion.dnd.afterAPlaceholder(elem)){
			let placeholder = document.createElement('p');
			placeholder.innerText = `This is a placeholder before ${elem.id}`;
			placeholder.classList.add('placeholder');
			placeholder.dataset.beforeElem = elem.id;
			parentElement.insertBefore(placeholder, elem);
		}

		if(!document.enchiridion.dnd.beforeAPlaceholder(elem)){
			let placeholder2 = document.createElement('p');
			placeholder2.innerText = `This is a placeholder after ${elem.id}`;
			placeholder2.classList.add('placeholder');
			placeholder2.dataset.afterElem = elem.id;
			parentElement.insertBefore(placeholder2, nextElementSibling);
		}
	}
};
