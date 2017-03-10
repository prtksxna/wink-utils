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
var frc = require( '../lib/text_frc.js' );

var indexedSearchRules = require( './data/text_frc/indexed_search_rules.json' );
var linearSearchRules = require( './data/text_frc/linear_search_rules.json' );
var idxSrchDLRules = require( './data/text_frc/idx_srch_dl_rules.json' );


var expect = chai.expect;
var describe = mocha.describe;
var it = mocha.it;

/* eslint object-curly-newline: [ "error", "never" ] */
/* eslint-disable object-property-newline */

describe( 'textFRC() behaviour when rules contain errors', function () {
  var rules01 = 1;
  it( 'should throw error when input is ' + JSON.stringify( rules01 ), function () {
    expect( frc.bind( null, rules01 ) ).to.throw( /rules should be an object, instead found: 1$/ );
  } );

  var rules02 = {};
  it( 'should throw error when input is ' + JSON.stringify( rules02 ), function () {
    expect( frc.bind( null, rules02 ) ).to.throw( /Synonyms should be an array, instead found: undefined$/ );
  } );

  var rules03 = { synonyms: [] };
  it( 'should throw error when input is ' + JSON.stringify( rules03 ), function () {
    expect( frc.bind( null, rules03 ) ).to.throw( /similarityMeasure should be an array, instead found: undefined$/ );
  } );

  var rules05 = { synonyms: [], similarityMeasure: [] };
  it( 'should throw error when input is ' + JSON.stringify( rules05 ), function () {
    expect( frc.bind( null, rules05 ) ).to.throw( /similarityMeasure function name should be a string, instead found: undefined$/ );
  } );

  var rules06 = { synonyms: [], similarityMeasure: [ 'junk' ] };
  it( 'should throw error when input is ' + JSON.stringify( rules06 ), function () {
    expect( frc.bind( null, rules06 ) ).to.throw( /similarityMeasure function is invalid: "junk"$/ );
  } );

  var rules07 = { synonyms: [], similarityMeasure: [ 'set.tversky' ], similarityPrepTasks: 1 };
  it( 'should throw error when input is ' + JSON.stringify( rules07 ), function () {
    expect( frc.bind( null, rules07 ) ).to.throw( /similarityPrepTasks should be an array of array, instead found: 1$/ );
  } );

  var rules08 = { synonyms: [], similarityMeasure: [ 'set.tversky' ], similarityPrepTasks: [ 1 ] };
  it( 'should throw error when input is ' + JSON.stringify( rules08 ), function () {
    expect( frc.bind( null, rules08 ) ).to.throw( /A task inside similarityPrepTasks should be an array, instead found: 1$/ );
  } );

  var rules09 = { synonyms: [], similarityMeasure: [ 'set.tversky' ], similarityPrepTasks: [ [] ] };
  it( 'should throw error when input is ' + JSON.stringify( rules09 ), function () {
    expect( frc.bind( null, rules09 ) ).to.throw( /A task inside similarityPrepTasks function name should be a string, instead found: undefined$/ );
  } );

  var rules10 = { synonyms: [], similarityMeasure: [ 'set.tversky' ], similarityPrepTasks: [ [ 'junk' ] ] };
  it( 'should throw error when input is ' + JSON.stringify( rules10 ), function () {
    expect( frc.bind( null, rules10 ) ).to.throw( /A task inside similarityPrepTasks function is invalid: "junk"$/ );
  } );

  var rules11 = { synonyms: [], similarityMeasure: [ 'set.tversky' ], similarityPrepTasks: [ [ 'string.trim' ] ], stopWords: 1 };
  it( 'should throw error when input is ' + JSON.stringify( rules11 ), function () {
    expect( frc.bind( null, rules11 ) ).to.throw( /Stop Words should be an array, instead found: 1$/ );
  } );

  var rules12 = { synonyms: [], similarityMeasure: [ 'set.tversky' ], similarityPrepTasks: [ [ 'string.tokenize' ] ], stopWords: [ 1 ] };
  it( 'should throw error when input is ' + JSON.stringify( rules12 ), function () {
    expect( frc.bind( null, rules12 ) ).to.throw( /stop word should be non-empty string, instead found: 1$/ );
  } );

  var rules12a = { synonyms: [], similarityMeasure: [ 'set.tversky' ], similarityPrepTasks: [ [ 'string.tokenize' ] ], stopWords: [ '' ] };
  it( 'should throw error when input is ' + JSON.stringify( rules12a ), function () {
    expect( frc.bind( null, rules12a ) ).to.throw( /stop word should be non-empty string, instead found: ""$/ );
  } );

  var rules13 = { synonyms: [], similarityMeasure: [ 'set.tversky' ], similarityPrepTasks: [ [ 'string.trim' ] ], stopWords: [ 'will' ],
    stopWordsPrepTasks: [ [ 'string.tokenize' ] ] };
  it( 'should throw error when input is ' + JSON.stringify( rules13 ), function () {
    expect( frc.bind( null, rules13 ) ).to.throw( /stop words Prep Tasks should return a string and not tokens: "string.tokenize"$/ );
  } );

  var rules14 = { synonyms: [], similarityMeasure: [ 'set.tversky' ], similarityPrepTasks: [ [ 'string.trim' ] ], stopWords: [ 'will' ],
    stopWordsPrepTasks: [ [ 'string.tokenize', {} ] ] };
  it( 'should throw error when input is ' + JSON.stringify( rules14 ), function () {
    expect( frc.bind( null, rules14 ) ).to.throw( /A task inside stopWordsPrepTasks argument should be an number\/boolean, instead found: {}$/ );
  } );

  var rules15 = { synonyms: [], similarityMeasure: [ 'set.tversky' ], similarityPrepTasks: [ [ 'string.trim' ] ], stopWords: [ 'will' ],
    stopWordsPrepTasks: [ [ 'helper.index' ] ] };
  it( 'should throw error when input is ' + JSON.stringify( rules15 ), function () {
    expect( frc.bind( null, rules15 ) ).to.throw( /Invalid function usage in stopWordsPrepTasks Prep Tasks: \[\["helper\.index"\]\]$/ );
  } );

  var rules16 = { synonyms: [], similarityMeasure: [ 'set.tversky' ], similarityPrepTasks: [ [ 'string.trim' ] ], stopWords: [ 'will' ],
    stopWordsPrepTasks: [ [ 'string.tokenize' ], [ 'tokens.removeWords', 2 ] ] };
  it( 'should throw error when input is ' + JSON.stringify( rules16 ), function () {
    expect( frc.bind( null, rules16 ) ).to.throw( /tokens\.removeWords in A task inside stopWordsPrepTasks should not have any arguments; but found: "2"$/ );
  } );

  var rules17 = { synonyms: [], similarityMeasure: [ 'set.tversky' ], similarityPrepTasks: [ [ 'string.tokenize' ], [ 'tokens.stem' ],
    [ 'string.trim' ] ] };
  it( 'should throw error when input is ' + JSON.stringify( rules17 ), function () {
    expect( frc.bind( null, rules17 ) ).to.throw( /similarityPrepTasks expected a tokens function, instead found: "string\.trim"$/ );
  } );

  var rules18 = { synonyms: [ 1 ], similarityMeasure: [ 'set.tversky' ] };
  it( 'should throw error when input is ' + JSON.stringify( rules18 ), function () {
    expect( frc.bind( null, rules18 ) ).to.throw( /Synonym should be an object, instead found: 1$/ );
  } );

  var rules19 = { synonyms: [ { category: 10 } ], similarityMeasure: [ 'set.tversky' ] };
  it( 'should throw error when input is ' + JSON.stringify( rules19 ), function () {
    expect( frc.bind( null, rules19 ) ).to.throw( /Invalid\/duplicate category found: 10$/ );
  } );

  var rules20 = { synonyms: [ { category: 'cat1' } ], similarityMeasure: [ 'set.tversky' ] };
  it( 'should throw error when input is ' + JSON.stringify( rules20 ), function () {
    expect( frc.bind( null, rules20 ) ).to.throw( /identifier should be an array of strings, instead found: undefined$/ );
  } );

  var rules21 = { synonyms: [ { category: 'cat1', identifiers: [] } ], similarityMeasure: [ 'set.tversky' ] };
  it( 'should throw error when input is ' + JSON.stringify( rules21 ), function () {
    expect( frc.bind( null, rules21 ) ).to.throw( /identifier should be an array of strings, instead found: \[\]$/ );
  } );

  var rules22 = { synonyms: [ { category: 'cat1', identifiers: [ 'id1 ' ] }, { category: 'cat1', identifiers: [ 'id2 ' ] } ],
    similarityMeasure: [ 'set.tversky' ] };
  it( 'should throw error when input is ' + JSON.stringify( rules22 ), function () {
    expect( frc.bind( null, rules22 ) ).to.throw( /Invalid\/duplicate category found: "cat1"$/ );
  } );

  var rules23 = { synonyms: [ { category: 'cat1', identifiers: [ 1 ] } ], similarityMeasure: [ 'set.tversky' ] };
  it( 'should throw error when input is ' + JSON.stringify( rules23 ), function () {
    expect( frc.bind( null, rules23 ) ).to.throw( /Identifier should be a non-empty string, instead found: 1$/ );
  } );

} );


describe( 'textFRC() behaviour when valid rules are given', function () {
  it( 'should return a function predict when input is a valid rules JSON', function () {
    expect( typeof frc( indexedSearchRules ).predict ).to.deep.equal( 'function' );
  } );
} );

describe( 'textFRC() behaviour when valid indexed search rules are given', function () {
  var predict = frc( indexedSearchRules ).predict;
  it( 'should return a function predict when input is a valid rules JSON', function () {
    expect( predict( 'set & object' ) ).to.deep.equal( [ [ 'set', 0.6666666666666666 ] ] );
  } );
} );

describe( 'textFRC() behaviour when valid linear search rules are given', function () {
  var predict = frc( linearSearchRules ).predict;
  it( 'should return a function predict when input is a valid rules JSON', function () {
    expect( predict( 'objects & set' ) ).to.deep.equal( [ [ 'set', 0.6666666666666666 ] ] );
  } );

  it( 'should return a function predict when input is a valid rules JSON', function () {
    expect( predict(  ) ).to.deep.equal( undefined );
  } );
} );

describe( 'textFRC() behaviour when valid indexed search with DL rules are given', function () {
  var predict = frc( idxSrchDLRules ).predict;
  it( 'should return a function predict when input is a valid rules JSON', function () {
    expect( predict( 'rchna' ) ).to.deep.equal( [ [ 'girl', 0.8333333333333334 ] ] );
    expect( predict( 'archna' ) ).to.deep.equal( [ [ undefined, 0 ] ] );
  } );
} );
