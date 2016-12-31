window.addEventListener('load', function(){
	let main = document.getElementById('container'),

	inCollection = function(item, collection){
		return collection.indexOf(item) >= 0;
	},

	isSameFormat = function(droppedElem, recievingElement){
		let sameFormat = droppedElem === recievingElement;
		console.log(`Dropped ${droppedElem} on ${recievingElement}`);
		console.log('sameFormat: ', sameFormat);
		return sameFormat
	},

	dataTransferRetrievalHack = function(dataset, keyPrefix){
		for(index in dataset){
			if (dataset[index].startsWith(keyPrefix)){
				return dataset[index].substring(keyPrefix.length);
			}
		}
	},

	produceOverlay = function(target, dataTypes){
		let fmt = dataTransferRetrievalHack(dataTypes, 'fmt'),
			droppedId = dataTransferRetrievalHack(dataTypes, 'id'),
			sameFormat = isSameFormat(fmt, target.dataset.format);

		if(target.getElementsByClassName('overlay').length === 0
			&& !target.classList.contains('overlay')
			// Doesn't have overlay or is overlay
			&& !target.classList.contains('placeholder')
			&& target.id !== droppedId		// Don't allow dropping on self
		){
			let elem = document.createElement('div');
			elem.innerHTML = '<span class="overlay parallel">∥</span>';
			if(!sameFormat){
				elem.innerHTML += '<span class="overlay altFormat">⊥</span>';
			}
			elem.classList.add('overlay');
			target.appendChild(elem);
			console.log('Overlay for ', target.id, ' generated');
		}
		else {
			console.log('No overlay');
		}
	},

	producePlaceHolder = function(preceeding, container){
		if(preceeding && preceeding.id){
			// console.log(`Placeholder before ${preceeding.id}`);
			let placeholder = document.createElement('p');
			placeholder.innerText = 'This is a placeholder';
			placeholder.id = `before${preceeding.id}`;
			placeholder.classList.add('placeholder');
			container.insertBefore(placeholder, preceeding);
		}
	},


	modifyCurrentTarget = function(target){
		let childNodes = [... target.children];
		if(childNodes.length > 0){
			console.log('There are inner elements');
			childNodes.forEach(cn => {
				producePlaceHolder(cn, target);
			});
			producePlaceHolder(null, target);
		}
		else{
			console.log('This is the innermost element');
		}
	},

	cleanupFormerTarget = function(target){
		let toPurge = [... document.getElementsByClassName('placeholder')];
		if(target){
			let siblings = [... target.parentElement.children];
			toPurge = toPurge.filter(elem => !inCollection(elem, siblings));
		}
		else{
			console.log('Purges placeholder');
			// let overlays = [... document.getElementsByClassName('overlay')];
			// overlays.forEach( elem => elem.parentElement.removeChild(elem));
		}
		toPurge.forEach( elem => elem.parentElement.removeChild(elem));
	};

	// Loads the data when the drag starts
	main.addEventListener('dragstart', function(e){
		e.dataTransfer.setData("text/plain", e.target.id);
		e.dataTransfer.setData("format", e.target.dataset.format);
		let fmtKey = "fmt" + e.target.dataset.format;
		e.dataTransfer.setData(fmtKey, 'Hack reqiured to expose format to dragenter');
		let idKey = "id" + e.target.id;
		e.dataTransfer.setData(idKey, 'Hack reqiured to expose format to dragenter');
		// http://stackoverflow.com/questions/11065803/determine-what-is-being-dragged-from-dragenter-dragover-events?rq=1
	});

	// Doesn't do anything of value.
	// Needed to stop it breaking
	main.addEventListener('dragover', function(e){
		e.preventDefault();
	});

	// Dragged element currently over a suitable container
	// Give the user cues
	main.addEventListener('dragenter', function(e){
		let target = e.target;
		e.preventDefault();

		produceOverlay(target, e.dataTransfer.types);
		// console.log('enter', target.id );
		target.classList.add('dropTarget');
		cleanupFormerTarget(target);
		modifyCurrentTarget(target);
	});

	// No longer over that element. Cues now misleading
	main.addEventListener('dragleave', function(e){
		e.preventDefault();
		let target = e.target;
		// console.log('leave', target.id);
		target.classList.remove('dropTarget');
	});

	// Element dropped onto a suitable element
	main.addEventListener('drop', function(e){
		let droppedElem = document.getElementById(e.dataTransfer.getData("text/plain"))
			recievingElement = e.target;

		if(droppedElem.isSameNode(recievingElement)){
			// console.log('Same element');
		}
		else {
			e.preventDefault();
			let recievingParent = recievingElement.parentElement,
				sameFormat = isSameFormat(droppedElem.dataset.format, recievingElement.dataset.format);

			console.log(`${droppedElem.id} was dropped on ${recievingElement.id}`);
			if(recievingElement.classList.contains('placeholder')){
				console.log('On a placeholder');
				var nextElem = recievingElement.nextElementSibling;
				recievingParent.insertBefore(droppedElem, nextElem);
				recievingParent.removeChild(recievingElement);
			}
			else {
				if(recievingElement.classList.contains('overlay')){
					if(recievingElement.classList.contains('parallel')){
						console.log('parallel');
					}
					if(recievingElement.classList.contains('altFormat')){
						console.log('altFormat');
					}
				}
				else{
					console.log('On content');
				}
			}
		}
		cleanupFormerTarget();
	});

	//dragend
	// Called when element is released.
	// Regardless of if it's a suitable recipent.
	main.addEventListener('dragend', function(e){
		e.preventDefault();
		[... document.querySelectorAll('.dropTarget')].forEach(e => e.classList.remove('dropTarget'));
	});
});
