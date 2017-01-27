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
var chai = require( 'chai' );
var mocha = require( 'mocha' );
var prepare = require( '../lib/prepare_text.js' );

var expect = chai.expect;
var describe = mocha.describe;
var it = mocha.it;

// Common test data for `null`, `undefined`, and `numeric` inputs.
var errors = [
  { whenInputIs: null, expectedOutputIs: /^Cannot read.*/ },
  { whenInputIs: undefined, expectedOutputIs: /^Cannot read.*/ },
  { whenInputIs: 1, expectedOutputIs: /is not a function$/ }
];

// Convert to Lower Case test cases.
describe( 'createIndex()', function () {
  var tests = [
    { whenInputIs: undefined, expectedOutputIs: Object.create( null ) }
  ];

  tests.forEach( function ( test ) {
    it( 'should return ' + JSON.stringify( test.expectedOutputIs ) + ' if the input is ' + JSON.stringify( test.whenInputIs ), function () {
      expect( prepare.createIndex( test.whenInputIs ) ).to.deep.equal( test.expectedOutputIs );
    } );
  } );
} );

// Convert to Lower Case test cases.
describe( 'string.lowerCase()', function () {
  var tests = [
    { whenInputIs: 'UPPERCASE', expectedOutputIs: 'uppercase' }
  ];

  tests.forEach( function ( test ) {
    it( 'should return ' + test.expectedOutputIs + ' if the input is ' + JSON.stringify( test.whenInputIs ), function () {
      expect( prepare.string.lowerCase( test.whenInputIs ) ).to.equal( test.expectedOutputIs );
    } );
  } );

  errors.forEach( function ( error ) {
    it( 'should throw ' + error.expectedOutputIs + ' if the input is ' + JSON.stringify( error.whenInputIs ), function () {
      expect( prepare.string.lowerCase.bind( null, error.whenInputIs ) ).to.throw( error.expectedOutputIs );
    } );
  } );
} );

// Convert to Upper Case test cases.
describe( 'string.upperCase()', function () {
  var tests = [
    { whenInputIs: 'lowercase', expectedOutputIs: 'LOWERCASE' }
  ];

  tests.forEach( function ( test ) {
    it( 'should return ' + test.expectedOutputIs + ' if the input is ' + JSON.stringify( test.whenInputIs ), function () {
      expect( prepare.string.upperCase( test.whenInputIs ) ).to.equal( test.expectedOutputIs );
    } );
  } );

  errors.forEach( function ( error ) {
    it( 'should throw ' + error.expectedOutputIs + ' if the input is ' + JSON.stringify( error.whenInputIs ), function () {
      expect( prepare.string.upperCase.bind( null, error.whenInputIs ) ).to.throw( error.expectedOutputIs );
    } );
  } );
} );

// Trim leading & trailing spaces test cases.
describe( 'string.trim()', function () {
  var tests = [
    { whenInputIs: '   has leading & trailing spaces   ', expectedOutputIs: 'has leading & trailing spaces' }
  ];

  tests.forEach( function ( test ) {
    it( 'should return ' + test.expectedOutputIs + ' if the input is ' + JSON.stringify( test.whenInputIs ), function () {
      expect( prepare.string.trim( test.whenInputIs ) ).to.equal( test.expectedOutputIs );
    } );
  } );

  errors.forEach( function ( error ) {
    it( 'should throw ' + error.expectedOutputIs + ' if the input is ' + JSON.stringify( error.whenInputIs ), function () {
      expect( prepare.string.trim.bind( null, error.whenInputIs ) ).to.throw( error.expectedOutputIs );
    } );
  } );
} );

// Remove Extra White Spaces test cases.
describe( 'string.removeExtraSpaces()', function () {
  var tests = [
    { whenInputIs: '', expectedOutputIs: '' },
    { whenInputIs: '        ', expectedOutputIs: '' },
    { whenInputIs: 'A sample sentence.', expectedOutputIs: 'A sample sentence.' },
    { whenInputIs: 'A  sample  sentence.', expectedOutputIs: 'A sample sentence.' },
    { whenInputIs: 'A    sample    sentence.', expectedOutputIs: 'A sample sentence.' },
    { whenInputIs: ' A sample sentence. ', expectedOutputIs: 'A sample sentence.' },
    { whenInputIs: '   A  sample    sentence.   ', expectedOutputIs: 'A sample sentence.' }
  ];

  tests.forEach( function ( test ) {
    it( 'should return ' + test.expectedOutputIs + ' if the input is ' + JSON.stringify( test.whenInputIs ), function () {
      expect( prepare.string.removeExtraSpaces( test.whenInputIs ) ).to.equal( test.expectedOutputIs );
    } );
  } );

  errors.forEach( function ( error ) {
    it( 'should throw ' + error.expectedOutputIs + ' if the input is ' + JSON.stringify( error.whenInputIs ), function () {
      expect( prepare.string.removeExtraSpaces.bind( null, error.whenInputIs ) ).to.throw( error.expectedOutputIs );
    } );
  } );
} );

// Clean Text test cases.
describe( 'string.retainAlphaNums()', function () {
  var tests = [
    { whenInputIs: '', expectedOutputIs: '' },
    { whenInputIs: '        ', expectedOutputIs: '' },
    { whenInputIs: 'A sample sentence.', expectedOutputIs: 'a sample sentence' },
    { whenInputIs: 'This is a ( somewhat )  complex (1)!?', expectedOutputIs: 'this is a somewhat complex 1' },
    { whenInputIs: '!@#$%^&*()', expectedOutputIs: '' },
    { whenInputIs: '  A1 [sample  ]? sentence with 123456   . ', expectedOutputIs: 'a1 sample sentence with 123456' }
  ];

  tests.forEach( function ( test ) {
    it( 'should return ' + test.expectedOutputIs + ' if the input is ' + JSON.stringify( test.whenInputIs ), function () {
      expect( prepare.string.retainAlphaNums( test.whenInputIs ) ).to.equal( test.expectedOutputIs );
    } );
  } );

  errors.forEach( function ( error ) {
    it( 'should throw ' + error.expectedOutputIs + ' if the input is ' + JSON.stringify( error.whenInputIs ), function () {
      expect( prepare.string.retainAlphaNums.bind( null, error.whenInputIs ) ).to.throw( error.expectedOutputIs );
    } );
  } );
} );

// Clean Name test cases.
describe( 'string.extractPersonsName()', function () {
  var tests = [
    { whenInputIs: '', expectedOutputIs: '' },
    { whenInputIs: '        ', expectedOutputIs: '' },
    { whenInputIs: 'Dr. Ashwini Kumar Sharma B Tech., M. Tech., PhD - Electrical', expectedOutputIs: 'Ashwini Kumar Sharma' },
    { whenInputIs: 'Dr. Ashwini Kumar Sharma', expectedOutputIs: 'Ashwini Kumar Sharma' },
    { whenInputIs: 'Dr. (Mrs.) B. Techpadma Rao M B B S (Gyne)', expectedOutputIs: 'B Techpadma Rao' },
    { whenInputIs: '  B. Techpadma Mtechrao L L B', expectedOutputIs: 'B Techpadma Mtechrao' },
    { whenInputIs: '  B. Tech Ramarao B. Tech., M. Tech.', expectedOutputIs: '' },
  ];

  tests.forEach( function ( test ) {
    it( 'should return ' + test.expectedOutputIs + ' if the input is ' + JSON.stringify( test.whenInputIs ), function () {
      expect( prepare.string.extractPersonsName( test.whenInputIs ) ).to.equal( test.expectedOutputIs );
    } );
  } );

  errors.forEach( function ( error ) {
    it( 'should throw ' + error.expectedOutputIs + ' if the input is ' + JSON.stringify( error.whenInputIs ), function () {
      expect( prepare.string.extractPersonsName.bind( null, error.whenInputIs ) ).to.throw( error.expectedOutputIs );
    } );
  } );
} );

// Get Run of Capital Words test cases.
describe( 'string.extractRunOfCapitalWords()', function () {
  var tests = [
    { whenInputIs: '', expectedOutputIs: null },
    { whenInputIs: '        ', expectedOutputIs: null },
    { whenInputIs: 'my both friends Ashwani Sharma & Kailash Kher are a nice persons', expectedOutputIs: [ 'Ashwani Sharma', 'Kailash Kher' ] },
    { whenInputIs: 'My name is Ram Asrey.', expectedOutputIs: [ 'My', 'Ram Asrey' ] }
  ];

  tests.forEach( function ( test ) {
    it( 'should return ' + test.expectedOutputIs + ' if the input is ' + JSON.stringify( test.whenInputIs ), function () {
      expect( prepare.string.extractRunOfCapitalWords( test.whenInputIs ) ).to.deep.equal( test.expectedOutputIs );
    } );
  } );

  errors.forEach( function ( error ) {
    it( 'should throw ' + error.expectedOutputIs + ' if the input is ' + JSON.stringify( error.whenInputIs ), function () {
      expect( prepare.string.extractRunOfCapitalWords.bind( null, error.whenInputIs ) ).to.throw( error.expectedOutputIs );
    } );
  } );
} );

// Remove Punctuation test cases.
describe( 'string.removePunctuations()', function () {
  var tests = [
    { whenInputIs: '', expectedOutputIs: '' },
    { whenInputIs: 'My sentence has all the punctuations like "\'\',;!?:"!... - () [] {} I don’t like it.', expectedOutputIs: 'My sentence has all the punctuations like                          I don t like it ' },
    { whenInputIs: '1234.50', expectedOutputIs: '1234 50' },
    { whenInputIs: '-1234', expectedOutputIs: ' 1234' },
    { whenInputIs: '(1234)', expectedOutputIs: ' 1234 ' },
    { whenInputIs: '10%', expectedOutputIs: '10%' },
    { whenInputIs: '(a^b) x (c^d)', expectedOutputIs: ' a^b  x  c^d ' },
    { whenInputIs: 'A sentence without any punctuations', expectedOutputIs: 'A sentence without any punctuations' },
    { whenInputIs: 'I have an appointment at 10,with Dr. Zakir at his residence: 12/190 - Willows\' Creek.', expectedOutputIs: 'I have an appointment at 10 with Dr  Zakir at his residence  12 190   Willows  Creek ' },
    { whenInputIs: 'Read s@me $pecial characters#-grammar ain\’t silly, it gives {structure} to your expression(s)', expectedOutputIs: 'Read s@me $pecial characters# grammar ain t silly  it gives  structure  to your expression s ' }
  ];

  tests.forEach( function ( test ) {
    it( 'should return ' + test.expectedOutputIs + ' if the input is ' + JSON.stringify( test.whenInputIs ), function () {
      expect( prepare.string.removePunctuations( test.whenInputIs ) ).to.equal( test.expectedOutputIs );
    } );
  } );

  errors.forEach( function ( error ) {
    it( 'should throw ' + error.expectedOutputIs + ' if the input is ' + JSON.stringify( error.whenInputIs ), function () {
      expect( prepare.string.removePunctuations.bind( null, error.whenInputIs ) ).to.throw( error.expectedOutputIs );
    } );
  } );
} );

// Remove special characters test cases.
describe( 'string.removeSplChars()', function () {
  var tests = [
    { whenInputIs: '', expectedOutputIs: '' },
    { whenInputIs: 'My sentence has all the special characters like~@#%^*+=.', expectedOutputIs: 'My sentence has all the special characters like        .' },
    { whenInputIs: 'hello@abc.com', expectedOutputIs: 'hello abc.com' },
    { whenInputIs: '@peter is my twitter handle', expectedOutputIs: ' peter is my twitter handle' },
    { whenInputIs: '#1. This is point number one.', expectedOutputIs: ' 1. This is point number one.' },
    { whenInputIs: 'I am using a ^ sign!', expectedOutputIs: 'I am using a   sign!' },
    { whenInputIs: 'There is 100% guarantee if you buy goods by December.', expectedOutputIs: 'There is 100  guarantee if you buy goods by December.' },
    { whenInputIs: 'Hello *y Nights', expectedOutputIs: 'Hello  y Nights' },
    { whenInputIs: 'Lemon + ginger + mint + water = infused water', expectedOutputIs: 'Lemon   ginger   mint   water   infused water' },
    { whenInputIs: 'Why is tilde~ used ?', expectedOutputIs: 'Why is tilde  used ?' }
  ];

  tests.forEach( function ( test ) {
    it( 'should return ' + test.expectedOutputIs + ' if the input is ' + JSON.stringify( test.whenInputIs ), function () {
      expect( prepare.string.removeSplChars( test.whenInputIs ) ).to.equal( test.expectedOutputIs );
    } );
  } );

  errors.forEach( function ( error ) {
    it( 'should throw ' + error.expectedOutputIs + ' if the input is ' + JSON.stringify( error.whenInputIs ), function () {
      expect( prepare.string.removeSplChars.bind( null, error.whenInputIs ) ).to.throw( error.expectedOutputIs );
    } );
  } );
} );

// Remove ellision test cases.
describe( 'string.removeElisions()', function () {
  var tests = [
    { whenInputIs: '', expectedOutputIs: '' },
    { whenInputIs: 'What dire offence from am\'rous causes springs', expectedOutputIs: 'What dire offence from am\'rous causes springs' },
    { whenInputIs: 'Is, to dispute well, logic\'s chiefest end?', expectedOutputIs: 'Is, to dispute well, logic\'s chiefest end?' },
    { whenInputIs: 'Isn\'t it?', expectedOutputIs: 'Is it?' },
    { whenInputIs: 'Did the lady\'s purse get stolen?', expectedOutputIs: 'Did the lady\'s purse get stolen?' },
    { whenInputIs: 'Sev\'n comes before eight.', expectedOutputIs: 'Sev\'n comes before eight.' },
    { whenInputIs: '\'Twas enough to make a man stare.', expectedOutputIs: '\'Twas enough to make a man stare.' },
  ];

  tests.forEach( function ( test ) {
    it( 'should return ' + test.expectedOutputIs + ' if the input is ' + JSON.stringify( test.whenInputIs ), function () {
      expect( prepare.string.removeElisions( test.whenInputIs ) ).to.equal( test.expectedOutputIs );
    } );
  } );

  errors.forEach( function ( error ) {
    it( 'should throw ' + error.expectedOutputIs + ' if the input is ' + JSON.stringify( error.whenInputIs ), function () {
      expect( prepare.string.removeElisions.bind( null, error.whenInputIs ) ).to.throw( error.expectedOutputIs );
    } );
  } );
} );

// Split ellision test cases.
describe( 'string.splitElisions()', function () {
  var tests = [
    { whenInputIs: '', expectedOutputIs: '' },
    { whenInputIs: 'Whatever we ain\'t got, that\'s what you want.', expectedOutputIs: 'Whatever we ai n\'t got, that \'s what you want.' },
    { whenInputIs: 'Oh, you can\'t help that," said the Cat: "we\'re all mad here. I\'m mad. You\'re mad.', expectedOutputIs: 'Oh, you ca n\'t help that," said the Cat: "we \'re all mad here. I \'m mad. You \'re mad.' },
    { whenInputIs: 'Isn\'t', expectedOutputIs: 'Is n\'t' },
  ];

  tests.forEach( function ( test ) {
    it( 'should return ' + test.expectedOutputIs + ' if the input is ' + JSON.stringify( test.whenInputIs ), function () {
      expect( prepare.string.splitElisions( test.whenInputIs ) ).to.equal( test.expectedOutputIs );
    } );
  } );

  errors.forEach( function ( error ) {
    it( 'should throw ' + error.expectedOutputIs + ' if the input is ' + JSON.stringify( error.whenInputIs ), function () {
      expect( prepare.string.splitElisions.bind( null, error.whenInputIs ) ).to.throw( error.expectedOutputIs );
    } );
  } );
} );

// Amplify Not ellision test cases.
describe( 'string.amplifyNotElision()', function () {
  var tests = [
    { whenInputIs: '', expectedOutputIs: '' },
    { whenInputIs: 'Whatever we ain\'t got, that\'s what you want.', expectedOutputIs: 'Whatever we ai not got, that\'s what you want.' },
    { whenInputIs: 'Oh, you can\'t help that," said the Cat: "we\’re all mad here. I\’m mad. You\’re mad.', expectedOutputIs: 'Oh, you ca not help that," said the Cat: "we\’re all mad here. I\’m mad. You\’re mad.' },
    { whenInputIs: 'Isn\'t', expectedOutputIs: 'Is not' },
    { whenInputIs: 'Can\'t sleep', expectedOutputIs: 'Ca not sleep' },
    { whenInputIs: 'haven\'t', expectedOutputIs: 'have not' },
    { whenInputIs: 'doesn\'t, aren\'t, mustn\'t', expectedOutputIs: 'does not, are not, must not' }
  ];

  tests.forEach( function ( test ) {
    it( 'should return ' + test.expectedOutputIs + ' if the input is ' + JSON.stringify( test.whenInputIs ), function () {
      expect( prepare.string.amplifyNotElision( test.whenInputIs ) ).to.equal( test.expectedOutputIs );
    } );
  } );

  errors.forEach( function ( error ) {
    it( 'should throw ' + error.expectedOutputIs + ' if the input is ' + JSON.stringify( error.whenInputIs ), function () {
      expect( prepare.string.amplifyNotElision.bind( null, error.whenInputIs ) ).to.throw( error.expectedOutputIs );
    } );
  } );
} );

// Generate marker test cases.
describe( 'string.marker()', function () {
  var tests = [
    { whenInputIs: '', expectedOutputIs: '' },
    { whenInputIs: '        ', expectedOutputIs: ' ' },
    { whenInputIs: 'rachna', expectedOutputIs: 'achnr' },
    { whenInputIs: 'archna', expectedOutputIs: 'achnr' },
    { whenInputIs: 'aaaaaaaaa', expectedOutputIs: 'a' },
    { whenInputIs: 'the quick brown fox jumps over the lazy dog', expectedOutputIs: ' abcdefghijklmnopqrstuvwxyz' },
  ];

  tests.forEach( function ( test ) {
    it( 'should return ' + test.expectedOutputIs + ' if the input is ' + JSON.stringify( test.whenInputIs ), function () {
      expect( prepare.string.marker( test.whenInputIs ) ).to.deep.equal( test.expectedOutputIs );
    } );
  } );

  errors.slice( 0, 2 ).forEach( function ( error ) {
    it( 'should throw ' + error.expectedOutputIs + ' if the input is ' + JSON.stringify( error.whenInputIs ), function () {
      expect( prepare.string.marker.bind( null, error.whenInputIs ) ).to.throw( error.expectedOutputIs );
    } );
  } );
} );

// Create ngram test cases.
describe( 'string.ngram()', function () {
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

  tests.forEach( function ( test ) {
    it( 'should return ' + JSON.stringify( test.expectedOutputIs ) + ' if the input is ' + JSON.stringify( test.whenInputIs ), function () {
      expect( prepare.string.ngram.apply( null, test.whenInputIs ) ).to.deep.equal( test.expectedOutputIs );
    } );
  } );

  errors.slice( 0, 2 ).forEach( function ( error ) {
    it( 'should throw ' + error.expectedOutputIs + ' if the input is ' + JSON.stringify( error.whenInputIs ), function () {
      expect( prepare.string.ngram.bind( null, error.whenInputIs ) ).to.throw( error.expectedOutputIs );
    } );
  } );
} );

// Create ngram with index test cases.
describe( 'string.ngramWithIndex()', function () {
  var ngIndex = prepare.createIndex();

  it( 'should return ' + JSON.stringify( {} ) + ' if the input is ' + JSON.stringify( [ '', 2, 0, ngIndex ] ), function () {
    expect( prepare.string.ngramWithIndex.apply( null, [ '', 2, 0, ngIndex ] ) ).to.deep.equal( {} );
    expect( ngIndex ).to.deep.equal( {} );
  } );

  it( 'should return ' + JSON.stringify( {} ) + ' if the input is ' + JSON.stringify( [ 'rachna', 2, 0, ngIndex ] ), function () {
    expect( prepare.string.ngramWithIndex.apply( null, [ 'rachna', 2, 1, ngIndex ] ) ).to.deep.equal( { ra: 1, ac: 1, ch: 1, hn: 1, na: 1 } );
    expect( ngIndex ).to.deep.equal( { ra: [ 1 ], ac: [ 1 ], ch: [ 1 ], hn: [ 1 ], na: [ 1 ] } );
  } );

  it( 'should return ' + JSON.stringify( {} ) + ' if the input is ' + JSON.stringify( [ 'archna', 2, 0, ngIndex ] ), function () {
    expect( prepare.string.ngramWithIndex.apply( null, [ 'archna', 2, 2, ngIndex ] ) ).to.deep.equal( { ar: 1, rc: 1, ch: 1, hn: 1, na: 1 } );
    expect( ngIndex ).to.deep.equal( { ra: [ 1 ], ac: [ 1 ], ch: [ 1, 2 ], hn: [ 1, 2 ], na: [ 1, 2 ], ar: [ 2 ], rc: [ 2 ] } );
  } );


  errors.slice( 0, 2 ).forEach( function ( error ) {
    it( 'should throw ' + error.expectedOutputIs + ' if the input is ' + JSON.stringify( error.whenInputIs ), function () {
      expect( prepare.string.ngramWithIndex.bind( null, error.whenInputIs ) ).to.throw( error.expectedOutputIs );
    } );
  } );
} );

// Create sentences test cases.
describe( 'string.sentences()', function () {
  var tests = [
    { whenInputIs: [ ' ' ] , expectedOutputIs: [ '' ] },
    { whenInputIs: [ 'rain rain go away, come again another day. Little Adrianna wants to go out and play.' ] , expectedOutputIs: [ 'rain rain go away, come again another day.', 'Little Adrianna wants to go out and play.' ] },
    { whenInputIs: [ 'what ended in the year 1919 ~?  1918 year ended when the year 1919 began:-)! Isn\'t it?', '^' ] , expectedOutputIs: [ 'what ended in the year 1919 ~?', '1918 year ended when the year 1919 began:-)!', 'Isn\'t it?' ] },
    { whenInputIs: [ 'The goods from Mexico in 2015 were worth about $60 billion more than the goods exported to Mexico! So federal revenue in the short term would increase by roughly $12 billion.', '|' ], expectedOutputIs: [ 'The goods from Mexico in 2015 were worth about $60 billion more than the goods exported to Mexico!', 'So federal revenue in the short term would increase by roughly $12 billion.' ] },
  ];

  tests.forEach( function ( test ) {
    it( 'should return ' + JSON.stringify( test.expectedOutputIs ) + ' if the input is ' + JSON.stringify( test.whenInputIs ), function () {
      expect( prepare.string.sentences.apply( null, test.whenInputIs ) ).to.deep.equal( test.expectedOutputIs );
    } );
  } );

  errors.slice( 0, 2 ).forEach( function ( error ) {
    it( 'should throw ' + error.expectedOutputIs + ' if the input is ' + JSON.stringify( error.whenInputIs ), function () {
      expect( prepare.string.sentences.bind( null, error.whenInputIs ) ).to.throw( error.expectedOutputIs );
    } );
  } );
} );
