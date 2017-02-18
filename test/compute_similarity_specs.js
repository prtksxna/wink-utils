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
var similarity = require( '../lib/compute_similarity.js' );
var prepare = require( '../lib/prepare_text.js' );

var expect = chai.expect;
var describe = mocha.describe;
var it = mocha.it;

// ### Define common errors.

// These are common test data for `null`, `undefined`, and `numeric` inputs
// across all the functions included in the script.
// The exception cases specific to the function are part of the test script of the function.

var errors = [
  { whenInputIs: null, expectedOutputIs: /^Cannot read.*/ },
  { whenInputIs: undefined, expectedOutputIs: /^Cannot read.*/ },
  { whenInputIs: 1, expectedOutputIs: /is not a function$/ }
];


// ### Set Jaccard test cases.

// Jaccard Similarity Index uses a pair of set of tokens representing inputs
// Set A -> `sa` and Set B ->`sb`.
// The expected value of index resides between 0 and 1. Floating points handling
// is left for user to handle.
// The test cases use sets of strings only, numbers only, and their combinations.
var setA = new Set( [ 'wonderland' ] );
var setB = new Set( [ 'wonderland' ] );
var setE = new Set( [ 'quiet' ] );
var setF = new Set( [ 'quite' ] );
var setC = new Set( [ 1, 2, 3, 4 ] );
var setG = new Set( [ 'Alice', 'looking', 'glass' ] );
describe( 'set.jaccard()', function () {
  var tests = [
    { whenInputIs: [ setE, setF ] , expectedOutputIs: 0 },
    { whenInputIs: [ setA, setC ] , expectedOutputIs: 0 },
    { whenInputIs: [ setB, setA ], expectedOutputIs: 1 },
    { whenInputIs: [ new Set( [ 'alice', 'in', 'wonderland' ] ), new Set( [ 'alice', 'in', 'wonder', 'land' ] ) ], expectedOutputIs: 0.4 },
    { whenInputIs: [ new Set( [ 'Harry', 'Potter', 'and', 'the', 'Deathly', 'Hallows' ] ), new Set( [ 'Harry', 'Potter', 'and', 'the', 'Deadly', 'Hallows' ] ) ], expectedOutputIs: 0.7142857142857143 },
    { whenInputIs: [ new Set( [ 'Harry', 'Potter', 'and', 'the', 'Deathly', 'Hallows' ] ), new Set( [ 'the', 'Deathly', 'Hallows', 'and', 'Harry', 'Potter' ] ) ], expectedOutputIs: 1 },
  ];
  tests.forEach( function ( test ) {
    it( 'should return ' + test.expectedOutputIs + ' if the input is ' + JSON.stringify( test.whenInputIs ), function () {
      expect( similarity.set.jaccard.apply( null, test.whenInputIs ) ).to.equal( test.expectedOutputIs );
    } );
  } );
  errors.forEach( function ( error ) {
    it( 'should throw ' + error.expectedOutputIs + ' if the input is ' + JSON.stringify( error.whenInputIs ), function () {
      expect( similarity.set.jaccard.bind( null, error.whenInputIs, error.whenInputIs ) ).to.throw( error.expectedOutputIs );
    } );
  } );
} );

// ### Set Tversky test cases

// Tversky Similarity Index is tested using the sets prepared for Jaccard tests.
// The input to the test function requires two sets: set a is the prototype and
// set b is the variant. The function is tested with and without assigning
// weights to the prototype and variant. The function assumes 50-50 weights in
// case no weight parameters are specified.
var setD = new Set( [ 'Alice', 'Wonderland' ] );
describe( 'set.tversky()', function () {
  var tests = [
    { whenInputIs: [ setA, setB ] , expectedOutputIs: 1 },
    { whenInputIs: [ setA, setD ] , expectedOutputIs: 0 },
    { whenInputIs: [ setB, setA ], expectedOutputIs: 1 },
    { whenInputIs: [ setA, setE, 0.9, 0.1 ] , expectedOutputIs: 0 },
    { whenInputIs: [ new Set( [ 'Alice', 'in', 'Wonderland' ] ), setD, 0.7, 0.3 ] , expectedOutputIs: 0.7407407407407407 },
    { whenInputIs: [ new Set( [ 'Alice', 'in', 'Wonderland' ] ), setD, 0.3, 0.7 ] , expectedOutputIs: 0.8695652173913044 },
    { whenInputIs: [ setB, setA, 0.7, 0.3 ] , expectedOutputIs: 1 },
    { whenInputIs: [ setA, setB, 0.1, 0.9 ] , expectedOutputIs: 1 },
    { whenInputIs: [ setC, setD, 0.3, 0.7 ] , expectedOutputIs: 0 },
    { whenInputIs: [ setE, setF, 0.3, 0.7 ] , expectedOutputIs: 0 },
    { whenInputIs: [ setD, setG ] , expectedOutputIs: 0.4 },
  ];
  tests.forEach( function ( test ) {
    it( 'should return ' + test.expectedOutputIs + ' if the input is ' + JSON.stringify( test.whenInputIs ), function () {
      expect( similarity.set.tversky.apply( null, test.whenInputIs ) ).to.equal( test.expectedOutputIs );
    } );
  } );
  errors.forEach( function ( error ) {
    it( 'should throw ' + error.expectedOutputIs + ' if the input is ' + JSON.stringify( error.whenInputIs ), function () {
      expect( similarity.set.tversky.bind( null, error.whenInputIs, error.whenInputIs ) ).to.throw( error.expectedOutputIs );
    } );
  } );
} );


// ### string dl test cases

// Damerau-Levenshtein(DL) similarity is a higher order function. It is
// tested by first creating function testsim.
// The function is tested with string of text, numbers,  text with
// special characters and empty strings.
// Special error handling cases has been included to test the max length (60)
// of the input strings and when both input strings are either null or empty.

var testsim = similarity.string.createDLFunction( );
describe( 'string.createDLFunction( )', function () {
  var tests = [
    { whenInputIs: [ ' ', '  '  ] , expectedOutputIs: { edits: 1, similarity: 0.5 } },
    { whenInputIs: [ 'Amsterdam', 'amsterdam'  ] , expectedOutputIs: { edits: 1, similarity: 0.8888888888888888 } },
    { whenInputIs: [ 'illusion', 'delusion' ] , expectedOutputIs: { edits: 2, similarity: 0.75 } },
    { whenInputIs: [ 'alternate', 'alternative' ] , expectedOutputIs: { edits: 2, similarity: 0.8181818181818181 } },
    { whenInputIs: [ 'ambivalent', 'ambiguous' ] , expectedOutputIs: { edits: 6, similarity: 0.4 } },
    { whenInputIs: [ 'xion@testmail.com', 'xion@testmail.com' ] , expectedOutputIs: { edits: 0, similarity: 1 } },
    { whenInputIs: [ 'xion@testmail.in', 'xion@testmail.com' ] , expectedOutputIs: { edits: 3, similarity: 0.8235294117647058 } },
    { whenInputIs: [ '100,300,000.00', '100,300,001.00' ] , expectedOutputIs: { edits: 1, similarity: 0.9285714285714286 } },
    { whenInputIs: [ 'lengthy', '' ], expectedOutputIs: { edits: 7, similarity: 0 } },
    { whenInputIs: [ '', 'lengthy' ], expectedOutputIs: { edits: 7, similarity: 0 } }
  ];

  tests.forEach( function ( test ) {
    it( 'should return ' + test.expectedOutputIs + ' if the input is ' + JSON.stringify( test.whenInputIs ), function () {
      expect( testsim( test.whenInputIs[0], test.whenInputIs[1] ) ).to.deep.equal( test.expectedOutputIs );
    } );
  } );

  var errors1 = [
    { whenInputIs: [ 'pneumonoultramicroscopicsilicovolcanoconiosispneumonoultramicroscopicsilicovolcanoconiosis', 'pneumonoultramicroscopicsilicovolcanoconiosispneumonoultramicroscopicsilicovolcanoconiosis' ], expectedOutputIs: /^Cannot set property.*/ },
    { whenInputIs: [], expectedOutputIs: /^Cannot read property.*/ },
    { whenInputIs: [ null, null ], expectedOutputIs: /^Cannot read property.*/ }
  ];

  errors1.forEach( function ( error ) {
    it( 'should throw ' + error.expectedOutputIs + ' if the input is ' + JSON.stringify( error.whenInputIs ), function () {
      expect( testsim.bind( null,  error.whenInputIs[0], error.whenInputIs[1]  ) ).to.throw( error.expectedOutputIs );
    } );
  } );
} );

// ### string exact tests

// String matches along with null and undefined inputs are tested.
describe( 'string.exact()', function () {
  var tests = [
    { whenInputIs: [ 'hello', 'hello' ] , expectedOutputIs: 1 },
    { whenInputIs: [ 'Elixir', 'Felix' ] , expectedOutputIs: 0 },
    { whenInputIs: [ ' ', '' ] , expectedOutputIs: 0 },
    { whenInputIs: [ undefined, null ] , expectedOutputIs: 0 },
    { whenInputIs: [ null, null ] , expectedOutputIs: 1 }
  ];
  tests.forEach( function ( test ) {
    it( 'should return ' + test.expectedOutputIs + ' if the input is ' + JSON.stringify( test.whenInputIs ), function () {
      expect( similarity.string.exact.apply( null, test.whenInputIs ) ).to.deep.equal( test.expectedOutputIs );
    } );
  } );
} );

// ### bow cosine similarity test cases

// This function requires two sets of bag of words as an input to determine the
// similarity between the given sets.
// In order to test this function, the input is given as sentences.
// In the forEach loop, these sentences are converted into tokens ( A and B)
// prepare.string.tokenize0 function.
// The tokenized output becomes an input for creating the Bag of words by
// using prepare.tokens.bow
// Special error handling is done for specific erros such as null, undefine bow
// and number and string is given as bow.

describe( 'bow.cosine( )', function () {
  var tests = [
    { whenInputIs: [ 'Merry Kurisumasu. I am Hotseiosha, a Japanese priest who acts like Santa Claus.', 'Santa Claus is enacted by Japanese priest, Merry Kurisumasu' ] , expectedOutputIs: 0.5547001962252291 },
    { whenInputIs: [ 'Hello, How are you ?', 'Good, How about you ?' ]  , expectedOutputIs: 0.5 },
    { whenInputIs: [ 'Sorry. Excuse me. Pardon me. Sorry. Excuse me.' , 'Yeah, Scuse me Oh! Pardon my galoshes.' ] , expectedOutputIs: 0.3563483225498992 },
    { whenInputIs: [ '   ' , 'is anyone there ? ' ] , expectedOutputIs: 0 },
    { whenInputIs: [ '' , 'is anyone there ? ' ] , expectedOutputIs: 0 }
  ];
  tests.forEach( function ( test ) {
    var tokensA = prepare.string.tokenize0( test.whenInputIs[ 0 ] );
    var tokensB = prepare.string.tokenize0( test.whenInputIs[ 1 ] );
    var bowA = prepare.tokens.bow( tokensA );
    var bowB = prepare.tokens.bow( tokensB );
    it( 'should return ' + test.expectedOutputIs + ' if the input is ' + JSON.stringify( test.whenInputIs ), function () {
      expect( similarity.bow.cosine( bowA, bowB ) ).to.deep.equal( test.expectedOutputIs );
    } );
  } );
    var specificErrors = [
      { whenInputIs: [ undefined, undefined ] , expectedOutputIs: 0 },
      { whenInputIs: [ null, null ] , expectedOutputIs: 0 },
      { whenInputIs: [ 1, 'A' ] , expectedOutputIs: 0 },
    ];
    specificErrors.forEach( function ( error ) {
    it( 'should return ' + error.expectedOutputIs + ' if the input is ' + JSON.stringify( error.whenInputIs ), function () {
      expect( similarity.bow.cosine.apply( null, error[ 0 ], error[ 1 ] ) ).to.deep.equal( error.expectedOutputIs );
    } );
  } );
} );
