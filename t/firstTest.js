/* globals QUnit, KeyboardEvent */
let invokeKeypress = function(assert, event, element, message) {
	element.addEventListener('keypress', e => {
		assert.deepEqual(e, event, message );
	});
	element.dispatchEvent(event);
};

// This check that the system responds to <Mod?-Enter>
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

// Test content creation. Call and check result
QUnit.test('createNewTransclusion', function( assert ) {
	let expectedElem = '<blockquote contenteditable="true">Fetching A transclusion</blockquote>',
		elem = document.enchiridion.transclusion.createNewTransclusion({
			container: document.getElementById('qunit-fixture'),
			innerText: 'A transclusion'
		})
	;
	assert.deepEqual(elem.outerHTML, expectedElem, 'Create transclusion elelment');
});

QUnit.test('createNewNonLinear', function( assert ) {
	let expectedElem = '<section class="nonLinear" contenteditable="true"></section>',
		elem = document.enchiridion.transclusion.createNewNonLinear({
				container: document.getElementById('qunit-fixture')
		})
	;
	assert.deepEqual(elem.outerHTML, expectedElem, 'Create transclusion elelment');
});

QUnit.test('createParagraph', function( assert ) {
	let expectedElem = '<p contenteditable="true">A transclusion</p>',
		elem = document.enchiridion.transclusion.createParagraph({
			container: document.getElementById('qunit-fixture'),
			innerText: 'A transclusion'
		})
	;
	assert.deepEqual(elem.outerHTML, expectedElem, 'Create transclusion elelment');
});
