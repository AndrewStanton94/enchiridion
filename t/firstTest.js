/* globals QUnit, KeyboardEvent */
let invokeKeypress = function(assert, event, element, message) {
	let done = assert.async();
	element.addEventListener('keypress', e => {
		assert.deepEqual(e, event, message );
		done();
	});
	element.dispatchEvent(event);
};

QUnit.module('<*?-Enter> event detection', () =>{
	QUnit.test('<Enter> in transclusionContainer', function( assert ) {
		let element = document.querySelector('#main p');
		invokeKeypress(assert,
			new KeyboardEvent('keypress', {key: 'Enter'}),
			element,
			'<Enter> detected'
		);
	});

	QUnit.test('<C-Enter> in transclusionContainer', function( assert ) {
		let element = document.querySelector('#main p');
		invokeKeypress(assert,
			new KeyboardEvent('keypress', {key: 'Enter', ctrlKey: true}),
			element,
			'<C-Enter> detected'
		);
	});

	QUnit.test('<S-Enter> in transclusionContainer', function( assert ) {
		let element = document.querySelector('#main p');
		invokeKeypress(assert,
			new KeyboardEvent('keypress', {key: 'Enter', shiftKey: true}),
			element,
			'<S-Enter> detected'
		);
	});

	QUnit.test('<A-Enter> in transclusionContainer', function( assert ) {
		let element = document.querySelector('#main p');
		invokeKeypress(assert,
			new KeyboardEvent('keypress', {key: 'Enter', altKey: true}),
			element,
			'<A-Enter> detected'
		);
	});
});

QUnit.module('Content creation', () =>{
	QUnit.test('createNewTransclusion', function( assert ) {
		assert.expect(3);
		let elem = document.enchiridion.transclusion.createNewTransclusion({
			container: document.getElementById('qunit-fixture'),
			innerText: 'A transclusion'
		});
		assert.equal(elem.tagName, 'BLOCKQUOTE', 'Transclusion has correct tag');
		assert.equal(elem.innerText, 'Fetching A transclusion', 'Transclusion has correct content');
		assert.ok(elem.getAttribute('contentEditable'), 'Transclusion is editable');
	});

	QUnit.test('createNewParallel', function( assert ) {
		assert.expect(4);
		let elem = document.enchiridion.transclusion.createNewParallel({
					container: document.getElementById('qunit-fixture')
		});

		assert.equal(elem.tagName, 'SECTION', 'Parallel has correct tag');
		assert.equal(elem.innerText, '', 'Parallel has correct content');
		assert.ok(elem.getAttribute('contentEditable'), 'Parallel is editable');
		assert.ok(elem.classList.contains('parallel'), 'Parallel has .parallel');
	});

	QUnit.test('createParagraph', function( assert ) {
		assert.expect(3);
		let elem = document.enchiridion.transclusion.createParagraph({
			container: document.getElementById('qunit-fixture'),
			innerText: 'A transclusion'
		});
		assert.equal(elem.tagName, 'P', 'Paragraph has correct tag');
		assert.equal(elem.innerText, 'A transclusion', 'Paragraph has correct content');
		assert.ok(elem.getAttribute('contentEditable'), 'Paragraphs are editable');
	});
});
