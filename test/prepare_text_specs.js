//     wink-utils
//     Utilities for Statistics, Text Mining,
//     Machine Learning, and more.
//
//     Copyright (C) 2017  GRAYPE Systems Private Limited
//
//     This file is part of “wink-utils”.
//
//     “wink-utils” is free software: you can redistribute it
//     and/or modify it under the terms of the GNU Affero
//     General Public License as published by the Free
//     Software Foundation, version 3 of the License.
//
//     “wink-utils” is distributed in the hope that it will
//     be useful, but WITHOUT ANY WARRANTY; without even
//     the implied warranty of MERCHANTABILITY or FITNESS
//     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
//     Public License for more details.
//
//     You should have received a copy of the GNU Affero
//     General Public License along with “wink-utils”.
//     If not, see <http://www.gnu.org/licenses/>.

//
var expect = require( "chai" ).expect;
var describe = require( "mocha" ).describe;
var it = require( "mocha" ).it;
var prepare = require( "../lib/prepare_text.js" );

// Common test data for `null`, `undefined`, and `numeric` inputs.
var errors = [
  { whenInputIs: null, expectedOutputIs: /^Cannot read.*/ },
  { whenInputIs: undefined, expectedOutputIs: /^Cannot read.*/ },
  { whenInputIs: 1, expectedOutputIs: /is not a function$/ }
];

// Convert to Lower Case test cases.
describe( 'createIndex()', function() {
  var tests = [
    { whenInputIs: undefined, expectedOutputIs: Object.create( null ) }
  ];

  tests.forEach( function( test ) {
    it( 'should return ' + JSON.stringify( test.expectedOutputIs ) + ' if the input is ' + JSON.stringify( test.whenInputIs ), function() {
      expect( prepare.createIndex( test.whenInputIs ) ).to.deep.equal( test.expectedOutputIs );
    } );
  } );
} );

// Convert to Lower Case test cases.
describe( 'string.lowerCase()', function() {
  var tests = [
    { whenInputIs: 'UPPERCASE', expectedOutputIs: 'uppercase' }
  ];

  tests.forEach( function( test ) {
    it( 'should return ' + test.expectedOutputIs + ' if the input is ' + JSON.stringify( test.whenInputIs ), function() {
      expect( prepare.string.lowerCase( test.whenInputIs ) ).to.equal( test.expectedOutputIs );
    } );
  } );

  errors.forEach( function( error ) {
    it( 'should return ' + error.expectedOutputIs + ' if the input is ' + JSON.stringify( error.whenInputIs ), function() {
      expect( prepare.string.lowerCase.bind( null, error.whenInputIs ) ).to.throw( error.expectedOutputIs );
    } );
  } );
} );

// Convert to Upper Case test cases.
describe( 'string.upperCase()', function() {
  var tests = [
    { whenInputIs: 'lowercase', expectedOutputIs: 'LOWERCASE' }
  ];

  tests.forEach( function( test ) {
    it( 'should return ' + test.expectedOutputIs + ' if the input is ' + JSON.stringify( test.whenInputIs ), function() {
      expect( prepare.string.upperCase( test.whenInputIs ) ).to.equal( test.expectedOutputIs );
    } );
  } );

  errors.forEach( function( error ) {
    it( 'should return ' + error.expectedOutputIs + ' if the input is ' + JSON.stringify( error.whenInputIs ), function() {
      expect( prepare.string.upperCase.bind( null, error.whenInputIs ) ).to.throw( error.expectedOutputIs );
    } );
  } );
} );

// Trim leading & trailing spaces test cases.
describe( 'string.trim()', function() {
  var tests = [
    { whenInputIs: '   has leading & trailing spaces   ', expectedOutputIs: 'has leading & trailing spaces' }
  ];

  tests.forEach( function( test ) {
    it( 'should return ' + test.expectedOutputIs + ' if the input is ' + JSON.stringify( test.whenInputIs ), function() {
      expect( prepare.string.trim( test.whenInputIs ) ).to.equal( test.expectedOutputIs );
    } );
  } );

  errors.forEach( function( error ) {
    it( 'should return ' + error.expectedOutputIs + ' if the input is ' + JSON.stringify( error.whenInputIs ), function() {
      expect( prepare.string.trim.bind( null, error.whenInputIs ) ).to.throw( error.expectedOutputIs );
    } );
  } );
} );

// Remove Extra White Spaces test cases.
describe( 'string.removeExtraSpaces()', function() {
  var tests = [
    { whenInputIs: '', expectedOutputIs: '' },
    { whenInputIs: '        ', expectedOutputIs: '' },
    { whenInputIs: 'A sample sentence.', expectedOutputIs: 'A sample sentence.' },
    { whenInputIs: 'A  sample  sentence.', expectedOutputIs: 'A sample sentence.' },
    { whenInputIs: 'A    sample    sentence.', expectedOutputIs: 'A sample sentence.' },
    { whenInputIs: ' A sample sentence. ', expectedOutputIs: 'A sample sentence.' },
    { whenInputIs: '   A  sample    sentence.   ', expectedOutputIs: 'A sample sentence.' }
  ];

  tests.forEach( function( test ) {
    it( 'should return ' + test.expectedOutputIs + ' if the input is ' + JSON.stringify( test.whenInputIs ), function() {
      expect( prepare.string.removeExtraSpaces( test.whenInputIs ) ).to.equal( test.expectedOutputIs );
    } );
  } );

  errors.forEach( function( error ) {
    it( 'should return ' + error.expectedOutputIs + ' if the input is ' + JSON.stringify( error.whenInputIs ), function() {
      expect( prepare.string.removeExtraSpaces.bind( null, error.whenInputIs ) ).to.throw( error.expectedOutputIs );
    } );
  } );
} );

// Clean Text test cases.
describe( 'string.retainAlphaNums()', function() {
  var tests = [
    { whenInputIs: '', expectedOutputIs: '' },
    { whenInputIs: '        ', expectedOutputIs: '' },
    { whenInputIs: 'A sample sentence.', expectedOutputIs: 'a sample sentence' },
    { whenInputIs: 'This is a ( somewhat )  complex (1)!?', expectedOutputIs: 'this is a somewhat complex 1' },
    { whenInputIs: '!@#$%^&*()', expectedOutputIs: '' },
    { whenInputIs: '  A1 [sample  ]? sentence with 123456   . ', expectedOutputIs: 'a1 sample sentence with 123456' }
  ];

  tests.forEach( function( test ) {
    it( 'should return ' + test.expectedOutputIs + ' if the input is ' + JSON.stringify( test.whenInputIs ), function() {
      expect( prepare.string.retainAlphaNums( test.whenInputIs ) ).to.equal( test.expectedOutputIs );
    } );
  } );

  errors.forEach( function( error ) {
    it( 'should return ' + error.expectedOutputIs + ' if the input is ' + JSON.stringify( error.whenInputIs ), function() {
      expect( prepare.string.retainAlphaNums.bind( null, error.whenInputIs ) ).to.throw( error.expectedOutputIs );
    } );
  } );
} );

// Clean Name test cases.
describe( 'string.extractPersonsName()', function() {
  var tests = [
    { whenInputIs: '', expectedOutputIs: '' },
    { whenInputIs: '        ', expectedOutputIs: '' },
    { whenInputIs: 'Dr. Ashwini Kumar Sharma B Tech., M. Tech., PhD - Electrical', expectedOutputIs: 'Ashwini Kumar Sharma' },
    { whenInputIs: 'Dr. Ashwini Kumar Sharma', expectedOutputIs: 'Ashwini Kumar Sharma' },
    { whenInputIs: 'Dr. (Mrs.) B. Techpadma Rao M B B S (Gyne)', expectedOutputIs: 'B Techpadma Rao' },
    { whenInputIs: '  B. Techpadma Mtechrao L L B', expectedOutputIs: 'B Techpadma Mtechrao' },
    { whenInputIs: '  B. Tech Ramarao B. Tech., M. Tech.', expectedOutputIs: '' },
  ];

  tests.forEach( function( test ) {
    it( 'should return ' + test.expectedOutputIs + ' if the input is ' + JSON.stringify( test.whenInputIs ), function() {
      expect( prepare.string.extractPersonsName( test.whenInputIs ) ).to.equal( test.expectedOutputIs );
    } );
  } );

  errors.forEach( function( error ) {
    it( 'should return ' + error.expectedOutputIs + ' if the input is ' + JSON.stringify( error.whenInputIs ), function() {
      expect( prepare.string.extractPersonsName.bind( null, error.whenInputIs ) ).to.throw( error.expectedOutputIs );
    } );
  } );
} );

// Get Run of Capital Words test cases.
describe( 'string.extractRunOfCapitalWords()', function() {
  var tests = [
    { whenInputIs: '', expectedOutputIs: null },
    { whenInputIs: '        ', expectedOutputIs: null },
    { whenInputIs: 'my both friends Ashwani Sharma & Kailash Kher are a nice persons', expectedOutputIs: [ 'Ashwani Sharma', 'Kailash Kher' ] },
    { whenInputIs: 'My name is Ram Asrey.', expectedOutputIs: [ 'My', 'Ram Asrey' ] }
  ];

  tests.forEach( function( test ) {
    it( 'should return ' + test.expectedOutputIs + ' if the input is ' + JSON.stringify( test.whenInputIs ), function() {
      expect( prepare.string.extractRunOfCapitalWords( test.whenInputIs ) ).to.deep.equal( test.expectedOutputIs );
    } );
  } );

  errors.forEach( function( error ) {
    it( 'should return ' + error.expectedOutputIs + ' if the input is ' + JSON.stringify( error.whenInputIs ), function() {
      expect( prepare.string.extractRunOfCapitalWords.bind( null, error.whenInputIs ) ).to.throw( error.expectedOutputIs );
    } );
  } );
} );

// Generate marker test cases.
describe( 'string.marker()', function() {
  var tests = [
    { whenInputIs: '', expectedOutputIs: '' },
    { whenInputIs: '        ', expectedOutputIs: ' ' },
    { whenInputIs: 'rachna', expectedOutputIs: 'achnr' },
    { whenInputIs: 'archna', expectedOutputIs: 'achnr' },
    { whenInputIs: 'aaaaaaaaa', expectedOutputIs: 'a' },
    { whenInputIs: 'the quick brown fox jumps over the lazy dog', expectedOutputIs: ' abcdefghijklmnopqrstuvwxyz' },
  ];

  tests.forEach( function( test ) {
    it( 'should return ' + test.expectedOutputIs + ' if the input is ' + JSON.stringify( test.whenInputIs ), function() {
      expect( prepare.string.marker( test.whenInputIs ) ).to.deep.equal( test.expectedOutputIs );
    } );
  } );

  errors.slice( 0, 2 ).forEach( function( error ) {
    it( 'should return ' + error.expectedOutputIs + ' if the input is ' + JSON.stringify( error.whenInputIs ), function() {
      expect( prepare.string.marker.bind( null, error.whenInputIs ) ).to.throw( error.expectedOutputIs );
    } );
  } );
} );

// Create ngram test cases.
describe( 'string.ngram()', function() {
  var tests = [
    { whenInputIs: [ '' ], expectedOutputIs: Object.create( null ) },
    { whenInputIs: [ 'some string' ], expectedOutputIs: Object.create( null ) },
    { whenInputIs: [ '', 2 ], expectedOutputIs: Object.create( null ) },
    { whenInputIs: [ '        ', 2 ], expectedOutputIs: { '  ': 7 } },
    { whenInputIs: [ 'archna', 2 ], expectedOutputIs: { ar: 1, rc: 1, ch: 1, hn: 1, na: 1 } },
    { whenInputIs: [ 'rachna', 2 ], expectedOutputIs: { ra: 1, ac: 1, ch: 1, hn: 1, na: 1 } },
    { whenInputIs: [ 'rachna', 6 ], expectedOutputIs: { rachna: 1 } },
    { whenInputIs: [ 'rachna', 0 ], expectedOutputIs: { '': 6 } },
    { whenInputIs: [ 'rachna', 7 ], expectedOutputIs: Object.create( null ) },
    { whenInputIs: [ 'mamma', 2 ], expectedOutputIs: { ma: 2, am: 1, mm: 1 } },
    { whenInputIs: [ 'rain rain', 3 ], expectedOutputIs: { ' ra': 1, ain: 2, 'in ': 1, 'n r': 1, rai: 2 } },
  ];

  tests.forEach( function( test ) {
    it( 'should return ' + JSON.stringify( test.expectedOutputIs ) + ' if the input is ' + JSON.stringify( test.whenInputIs ), function() {
      expect( prepare.string.ngram.apply( null, test.whenInputIs ) ).to.deep.equal( test.expectedOutputIs );
    } );
  } );

  errors.slice( 0, 2 ).forEach( function( error ) {
    it( 'should return ' + error.expectedOutputIs + ' if the input is ' + JSON.stringify( error.whenInputIs ), function() {
      expect( prepare.string.ngram.bind( null, error.whenInputIs ) ).to.throw( error.expectedOutputIs );
    } );
  } );
} );

// Create ngram with index test cases.
describe( 'string.ngramWithIndex()', function() {
  var ngIndex = prepare.createIndex();

  it( 'should return ' + JSON.stringify( {} ) + ' if the input is ' + JSON.stringify( [ '', 2, 0, ngIndex ] ), function() {
    expect( prepare.string.ngramWithIndex.apply( null, [ '', 2, 0, ngIndex ] ) ).to.deep.equal( {} );
    expect( ngIndex ).to.deep.equal( {} );
  } );

  it( 'should return ' + JSON.stringify( {} ) + ' if the input is ' + JSON.stringify( [ 'rachna', 2, 0, ngIndex ] ), function() {
    expect( prepare.string.ngramWithIndex.apply( null, [ 'rachna', 2, 1, ngIndex ] ) ).to.deep.equal( { ra: 1, ac: 1, ch: 1, hn: 1, na: 1 } );
    expect( ngIndex ).to.deep.equal( { ra: [ 1 ], ac: [ 1 ], ch: [ 1 ], hn: [ 1 ], na: [ 1 ] } );
  } );

  it( 'should return ' + JSON.stringify( {} ) + ' if the input is ' + JSON.stringify( [ 'archna', 2, 0, ngIndex ] ), function() {
    expect( prepare.string.ngramWithIndex.apply( null, [ 'archna', 2, 2, ngIndex ] ) ).to.deep.equal( { ar: 1, rc: 1, ch: 1, hn: 1, na: 1 } );
    expect( ngIndex ).to.deep.equal( { ra: [ 1 ], ac: [ 1 ], ch: [ 1, 2 ], hn: [ 1, 2 ], na: [ 1, 2 ], ar: [ 2 ], rc: [ 2 ] } );
  } );


  errors.slice( 0, 2 ).forEach( function( error ) {
    it( 'should return ' + error.expectedOutputIs + ' if the input is ' + JSON.stringify( error.whenInputIs ), function() {
      expect( prepare.string.ngramWithIndex.bind( null, error.whenInputIs ) ).to.throw( error.expectedOutputIs );
    } );
  } );
} );
