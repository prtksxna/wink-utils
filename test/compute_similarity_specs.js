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
    { whenInputIs: [ setE, setF ], expectedOutputIs: { similarity: 0, distance: 1 } },
    { whenInputIs: [ setA, setC ], expectedOutputIs: { similarity: 0, distance: 1 } },
    { whenInputIs: [ setB, setA ], expectedOutputIs: { similarity: 1, distance: 0 } },
    { whenInputIs: [ new Set( [ 'alice', 'in', 'wonderland' ] ), new Set( [ 'alice', 'in', 'wonder', 'land' ] ) ], expectedOutputIs: { similarity: 0.4, distance: 0.6 } },
    { whenInputIs: [ new Set( [ 'Harry', 'Potter', 'and', 'the', 'Deathly', 'Hallows' ] ), new Set( [ 'Harry', 'Potter', 'and', 'the', 'Deadly', 'Hallows' ] ) ], expectedOutputIs: { similarity: 0.7142857142857143, distance: 1 - 0.7142857142857143 } },
    { whenInputIs: [ new Set( [ 'Harry', 'Potter', 'and', 'the', 'Deathly', 'Hallows' ] ), new Set( [ 'the', 'Deathly', 'Hallows', 'and', 'Harry', 'Potter' ] ) ], expectedOutputIs: { similarity: 1, distance: 0 } },
  ];
  tests.forEach( function ( test ) {
    it( 'should return ' + JSON.stringify( test.expectedOutputIs ) + ' if the input is ' + JSON.stringify( test.whenInputIs ), function () {
      expect( similarity.set.jaccard.apply( null, test.whenInputIs ) ).to.deep.equal( test.expectedOutputIs );
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
    { whenInputIs: [ setA, setB ], expectedOutputIs: { similarity: 1, distance: 0 } },
    { whenInputIs: [ setA, setD ], expectedOutputIs: { similarity: 0, distance: 1 } },
    { whenInputIs: [ setB, setA ], expectedOutputIs: { similarity: 1, distance: 0 } },
    { whenInputIs: [ setA, setE, 0.9, 0.1 ], expectedOutputIs: { similarity: 0, distance: 1 } },
    { whenInputIs: [ new Set( [ 'Alice', 'in', 'Wonderland' ] ), setD, 0.7, 0.3 ] , expectedOutputIs: { similarity: 0.7407407407407407, distance: 1 - 0.7407407407407407 } },
    { whenInputIs: [ new Set( [ 'Alice', 'in', 'Wonderland' ] ), setD, 0.3, 0.7 ] , expectedOutputIs: { similarity: 0.8695652173913044, distance: 1 - 0.8695652173913044 } },
    { whenInputIs: [ setB, setA, 0.7, 0.3 ], expectedOutputIs: { similarity: 1, distance: 0 } },
    { whenInputIs: [ setA, setB, 0.1, 0.9 ], expectedOutputIs: { similarity: 1, distance: 0 } },
    { whenInputIs: [ setC, setD, 0.3, 0.7 ], expectedOutputIs: { similarity: 0, distance: 1 } },
    { whenInputIs: [ setE, setF, 0.3, 0.7 ], expectedOutputIs: { similarity: 0, distance: 1 } },
    { whenInputIs: [ setD, setG ], expectedOutputIs: { similarity: 0.4, distance: 0.6 } },
  ];
  tests.forEach( function ( test ) {
    it( 'should return ' + JSON.stringify( test.expectedOutputIs ) + ' if the input is ' + JSON.stringify( test.whenInputIs ), function () {
      expect( similarity.set.tversky.apply( null, test.whenInputIs ) ).to.deep.equal( test.expectedOutputIs );
    } );
  } );
  errors.forEach( function ( error ) {
    it( 'should throw ' + error.expectedOutputIs + ' if the input is ' + JSON.stringify( error.whenInputIs ), function () {
      expect( similarity.set.tversky.bind( null, error.whenInputIs, error.whenInputIs ) ).to.throw( error.expectedOutputIs );
    } );
  } );
} );

// ### Jaro test cases

describe( 'string.jaro()', function () {
  var tests = [
    { whenInputIs: [ 'loans and accounts', 'loan account' ], expectedOutputIs: { similarity: 0.8333333333333334, distance: 1 - 0.8333333333333334 } },
    { whenInputIs: [ 'loan account', 'loans and accounts' ], expectedOutputIs: { similarity: 0.8333333333333334, distance: 1 - 0.8333333333333334 } },
    { whenInputIs: [ 'trace', 'crate' ], expectedOutputIs: { similarity: 0.7333333333333334, distance: 1 - 0.7333333333333334 } },
    { whenInputIs: [ 'trace', 'trace' ], expectedOutputIs: { similarity: 1, distance: 0 } },
    { whenInputIs: [ 'trace', '' ], expectedOutputIs: { similarity: 0, distance: 1 } },
    { whenInputIs: [ '', 'trace' ], expectedOutputIs: { similarity: 0, distance: 1 } },
    { whenInputIs: [ '', '' ], expectedOutputIs: { similarity: 1, distance: 0 } },
    { whenInputIs: [ 'abcd', 'badc' ], expectedOutputIs: { similarity: 0.8333333333333334, distance: 1 - 0.8333333333333334 } },
    { whenInputIs: [ 'abcd', 'dcba' ], expectedOutputIs: { similarity: 0.5, distance: 0.5 } },
    { whenInputIs: [ 'washington', 'notgnihsaw' ], expectedOutputIs: { similarity: 0.43333333333333335, distance: 1 - 0.43333333333333335 } },
    { whenInputIs: [ 'washington', 'washingtonx' ], expectedOutputIs: { similarity: 0.9696969696969697, distance: 1 - 0.9696969696969697 } },
  ];

  tests.forEach( function ( t ) {
    it( 'should return when input is ' + t.whenInputIs.join( ', ' ), function () {
      expect( similarity.string.jaro( t.whenInputIs[ 0 ], t.whenInputIs[ 1 ] ) ).to.deep.equal( t.expectedOutputIs );
    } );
  } );
} );

// ### Jaro-Winkler test cases

describe( 'string.jaroWinkler()', function () {
  var tests = [
    { whenInputIs: [ 'loans and accounts', 'loan account' ], expectedOutputIs: { similarity: 0.9, distance: 0.09999999999999998 } },
    { whenInputIs: [ 'donald', 'donavan' ], expectedOutputIs: { similarity: 0.8476190476190476, distance: 0.1523809523809524 } },
    // Notice the drop in similarity with rise in boost threshold.
    { whenInputIs: [ 'donald', 'donavan', 0.1, 0.85 ], expectedOutputIs: { similarity: 0.746031746031746, distance: 0.25396825396825395 } },
    // Notice rise in similarity with rise in scaling factor.
    { whenInputIs: [ 'donald', 'donavan', 0.2 ], expectedOutputIs: { similarity: 0.9492063492063492, distance: 0.050793650793650835 } },
    // Test importance of matches in the start of string.
    { whenInputIs: [ 'donald', 'donavanx', 0.1 ], expectedOutputIs: { similarity: 0.8333333333333334, distance: 0.16666666666666663 } },
    { whenInputIs: [ 'donald', 'xdonavan', 0.1 ], expectedOutputIs: { similarity: 0.7222222222222222, distance: 0.2777777777777778 } },
    { whenInputIs: [ 'donald', 'dxonavan', 0.1 ], expectedOutputIs: { similarity: 0.75, distance: 0.25 } },
    { whenInputIs: [ 'donald', 'doxnavan', 0.1 ], expectedOutputIs: { similarity: 0.7777777777777778, distance: 0.2222222222222222 } },
    { whenInputIs: [ 'trace', 'trace' ], expectedOutputIs: { similarity: 1, distance: 0 } },
  ];

  tests.forEach( function ( t ) {
    it( 'should return when input is ' + t.whenInputIs.join( ', ' ), function () {
      expect( similarity.string.jaroWinkler.apply( null, t.whenInputIs ) ).to.deep.equal( t.expectedOutputIs );
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
    { whenInputIs: [ ' ', '  '  ], expectedOutputIs: { distance: 1, similarity: 0.5 } },
    { whenInputIs: [ 'Amsterdam', 'amsterdam'  ], expectedOutputIs: { distance: 1, similarity: 0.8888888888888888 } },
    { whenInputIs: [ 'illusion', 'delusion' ], expectedOutputIs: { distance: 2, similarity: 0.75 } },
    { whenInputIs: [ 'alternate', 'alternative' ], expectedOutputIs: { distance: 2, similarity: 0.8181818181818181 } },
    { whenInputIs: [ 'ambivalent', 'ambiguous' ], expectedOutputIs: { distance: 6, similarity: 0.4 } },
    { whenInputIs: [ 'xion@testmail.com', 'xion@testmail.com' ], expectedOutputIs: { distance: 0, similarity: 1 } },
    { whenInputIs: [ 'xion@testmail.in', 'xion@testmail.com' ], expectedOutputIs: { distance: 3, similarity: 0.8235294117647058 } },
    { whenInputIs: [ '100,300,000.00', '100,300,001.00' ], expectedOutputIs: { distance: 1, similarity: 0.9285714285714286 } },
    { whenInputIs: [ 'lengthy', '' ], expectedOutputIs: { distance: 7, similarity: 0 } },
    { whenInputIs: [ '', 'lengthy' ], expectedOutputIs: { distance: 7, similarity: 0 } },
    // Only adjacent transpositions are handled:
    { whenInputIs: [ 'abc', 'ca' ], expectedOutputIs: { distance: 3, similarity: 0 } },
    { whenInputIs: [ 'acb', 'ca' ], expectedOutputIs: { distance: 2, similarity: 0.33333333333333337 } },
  ];

  tests.forEach( function ( test ) {
    it( 'should return ' + JSON.stringify( test.expectedOutputIs ) + ' if the input is ' + JSON.stringify( test.whenInputIs ), function () {
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
    { whenInputIs: [ 'hello', 'hello' ] , expectedOutputIs: { distance: 0, similarity: 1 } },
    { whenInputIs: [ 'Elixir', 'Felix' ] , expectedOutputIs: { distance: 1, similarity: 0 } },
    { whenInputIs: [ ' ', '' ] , expectedOutputIs: { distance: 1, similarity: 0 } },
    { whenInputIs: [ undefined, null ] , expectedOutputIs: { distance: 1, similarity: 0 } },
    { whenInputIs: [ null, null ] , expectedOutputIs: { distance: 0, similarity: 1 } }
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
    { whenInputIs: [ 'Merry Kurisumasu. I am Hotseiosha, a Japanese priest who acts like Santa Claus.', 'Santa Claus is enacted by Japanese priest, Merry Kurisumasu' ], expectedOutputIs: { similarity: 0.5547001962252291, distance: 1 - 0.5547001962252291 } },
    { whenInputIs: [ 'Hello, How are you ?', 'Good, How about you ?' ], expectedOutputIs: { similarity: 0.5, distance: 0.5 } },
    { whenInputIs: [ 'Sorry. Excuse me. Pardon me. Sorry. Excuse me.' , 'Yeah, Scuse me Oh! Pardon my galoshes.' ], expectedOutputIs: { similarity: 0.3563483225498992, distance: 1 - 0.3563483225498992 } },
    { whenInputIs: [ '   ' , 'is anyone there ? ' ], expectedOutputIs: { similarity: 0, distance: 1 } },
    { whenInputIs: [ '' , 'is anyone there ? ' ], expectedOutputIs: { similarity: 0, distance: 1 } }
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
      { whenInputIs: [ undefined, undefined ], expectedOutputIs: { similarity: 0, distance: 1 } },
      { whenInputIs: [ null, null ], expectedOutputIs: { similarity: 0, distance: 1 } },
      { whenInputIs: [ 1, 'A' ], expectedOutputIs: { similarity: 0, distance: 1 } },
    ];
    specificErrors.forEach( function ( error ) {
    it( 'should return ' + error.expectedOutputIs + ' if the input is ' + JSON.stringify( error.whenInputIs ), function () {
      expect( similarity.bow.cosine.apply( null, error[ 0 ], error[ 1 ] ) ).to.deep.equal( error.expectedOutputIs );
    } );
  } );
} );
