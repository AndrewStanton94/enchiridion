/* globals QUnit, KeyboardEvent */
let invokeKeypress = function() {
	let myElem = document.querySelector('#main p');
	console.log(myElem);
	let event = new KeyboardEvent('keypress', {key: 'Enter', shiftKey: true, bubbles: true});
	myElem.dispatchEvent(event);
	console.log(event);
};

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
