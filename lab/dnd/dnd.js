window.addEventListener('load', function(){
	let main = document.getElementById('container'),

	isSameFormat = function(droppedElem, recievingElement){
		let sameFormat = droppedElem === recievingElement;
		// console.log(`Dropped ${droppedElem} on ${recievingElement}`);
		// console.log('sameFormat: ', sameFormat);
		return sameFormat;
	},

	produceOverlay = function(target, draggedId, draggedFormat){
		let sameFormat = isSameFormat(draggedFormat, target.dataset.format);

		if(
			target.getElementsByClassName('overlay').length === 0
			&& !target.classList.contains('overlay')
			// Doesn't have overlay or is overlay
			&& !target.classList.contains('placeholder')
			&& target.id !== draggedId		// Don't allow dropping on self
		){
			let elem = document.createElement('div');
			elem.innerHTML = '<span class="overlay parallel">∥</span>';
			if(!sameFormat){
				elem.innerHTML += '<span class="overlay altFormat">⊥</span>';
			}
			elem.classList.add('overlay');
			target.appendChild(elem);
		}
		else {
			// console.log('No overlay');
		}
	},

	afterAPlaceholder = function(element){
		if (element.previousElementSibling){
			return element.previousElementSibling.classList.contains('placeholder');
		}
		else {
			return false;
		}
	},

	beforeAPlaceholder = function(element){
		if (element.nextElementSibling){
			return element.nextElementSibling.classList.contains('placeholder');
		}
		else {
			return false;
		}
	},

	produceAPlaceholder = function(elem, draggedId){
		if(elem.id === draggedId){
			// console.log('Not placeholdering self');
		}
		else{
			let parentElement = elem.parentElement,
				nextElementSibling = elem.nextElementSibling,
				previousElementSibling = elem.previousElementSibling,

				// Check attribute if object doesn't exist return default value
				// Move elsewhere later?
				checkAttr = function(object, attribute, compareAgainst, elseReturn){
					if (object){
						return object[attribute] === compareAgainst;
					}
					else {
						return elseReturn;
					}
				}
			;

			if(checkAttr(previousElementSibling, 'id', draggedId, false)
				|| afterAPlaceholder(elem)){
				// console.log('Not putting placeholder after dragged element (or another placeholder)');
			}
			else{
				let placeholder = document.createElement('p');
				placeholder.innerText = `This is a placeholder before ${elem.id}`;
				placeholder.classList.add('placeholder');
				parentElement.insertBefore(placeholder, elem);
			}

			if(checkAttr(nextElementSibling, 'id', draggedId, false)
				|| beforeAPlaceholder(elem)
			){
				// console.log('Not putting placeholder before dragged element (or another placeholder)');
			}
			else{
				let placeholder2 = document.createElement('p');
				placeholder2.innerText = `This is a placeholder after ${elem.id}`;
				placeholder2.classList.add('placeholder');
				parentElement.insertBefore(placeholder2, nextElementSibling);
			}
		}
	},

	cleanupFormerTarget = function(){
		let toPurge = [... document.getElementsByClassName('placeholder')],
			overlays = [... document.getElementsByClassName('overlay')];

		toPurge.forEach( elem => elem.parentElement.removeChild(elem));
		overlays.forEach( elem => elem.parentElement.removeChild(elem));
	};

	// Loads the data when the drag starts
	main.addEventListener('dragstart', function(e){
		let draggedId = e.target.id,
			draggableElements = [... document.querySelectorAll('[draggable]')];

		e.dataTransfer.setData('text/plain', draggedId);
		e.dataTransfer.setData('format', e.target.dataset.format);

		draggableElements.forEach(elem => {
			produceOverlay(
				elem,
				draggedId,
				e.target.dataset.format
			);

			produceAPlaceholder(elem, draggedId);
		});
	});

	// Doesn't do anything of value.
	// Needed to stop it breaking
	main.addEventListener('dragover', function(e){
		e.preventDefault();
	});

	// Dragged element currently over a suitable container
	// Give the user cues
	main.addEventListener('dragenter', function(e){
		e.preventDefault();
		let target = e.target;
		if (target.nodeType !== 3) {
			target.classList.add('dropTarget');
		}
	});

	// No longer over that element. Cues now misleading
	main.addEventListener('dragleave', function(e){
		e.preventDefault();
		let target = e.target;
		if (target.nodeType !== 3) {
			target.classList.remove('dropTarget');
		}
	});

	// Element dropped onto a suitable element
	main.addEventListener('drop', function(e){
		let droppedElem = document.getElementById(e.dataTransfer.getData('text/plain')),
			recievingElement = e.target;

		if(droppedElem.isSameNode(recievingElement)){
			// console.log('Same element');
		}
		else {
			e.preventDefault();
			let recievingParent = recievingElement.parentElement;

			if(recievingElement.classList.contains('placeholder')){
				console.log('On a placeholder');
				let nextElem = recievingElement.nextElementSibling;
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
		console.log(e);
		[... document.querySelectorAll('.dropTarget')].forEach(e => e.classList.remove('dropTarget'));
	});
});
