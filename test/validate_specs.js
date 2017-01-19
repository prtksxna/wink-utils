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
var validate = require( "../lib/validate.js" );

// Common test data for `null`, `undefined`, and `numeric` inputs.
var errors = [
  { whenInputIs: null, expectedOutputIs: /^Cannot read.*/ },
  { whenInputIs: undefined, expectedOutputIs: /^Cannot read.*/ },
  { whenInputIs: 1, expectedOutputIs: /is not a function$/ }
];

// Validate number with scale of measure test cases.
describe( 'numberWithSOM()', function() {
  var tests = [
    { whenInputIs: undefined, expectedOutputIs: null },
    { whenInputIs: '', expectedOutputIs: null },
    { whenInputIs: '     ', expectedOutputIs: null },
    { whenInputIs: '1.23 Kgs.', expectedOutputIs: { num: 1.23, som: 'Kgs.' } },
    { whenInputIs: '123 light years', expectedOutputIs: { num: 123, som: 'light years' } },
    { whenInputIs: '9.87e+34Kgs.', expectedOutputIs: { num: 9.87e+34, som: 'Kgs.' } },
  ];

  tests.forEach( function( test ) {
    it( 'should return ' + test.expectedOutputIs + ' if the input is ' + JSON.stringify( test.whenInputIs ), function() {
      expect( validate.numberWithSOM( test.whenInputIs ) ).to.deep.equal( test.expectedOutputIs );
    } );
  } );
} );

// Validate email test cases.
describe( 'email()', function() {
  var tests = [
    { whenInputIs: 'pappu*lost.com', expectedOutputIs: null },
    { whenInputIs: 'pappu@lost.', expectedOutputIs: null },
    { whenInputIs: ' 123@works.com ', expectedOutputIs: '123@works.com' },
    { whenInputIs: ' ceo@MyCompany.biz   ', expectedOutputIs: 'ceo@mycompany.biz' },
    { whenInputIs: ' My@Country.In      ', expectedOutputIs: 'my@country.in' },
  ];

  tests.forEach( function( test ) {
    it( 'should return ' + test.expectedOutputIs + ' if the input is ' + JSON.stringify( test.whenInputIs ), function() {
      expect( validate.email( test.whenInputIs ) ).to.equal( test.expectedOutputIs );
    } );
  } );

  errors.forEach( function( error ) {
    it( 'should return ' + error.expectedOutputIs + ' if the input is ' + JSON.stringify( error.whenInputIs ), function() {
      expect( validate.email.bind( null, error.whenInputIs ) ).to.throw( error.expectedOutputIs );
    } );
  } );
} );

// Validate non-Negative Real test cases.
describe( 'nonNegativeReal()', function() {
  var tests = [
    { whenInputIs: undefined, expectedOutputIs: null },
    { whenInputIs: null, expectedOutputIs: null },
    { whenInputIs: '', expectedOutputIs: null },
    { whenInputIs: '    ', expectedOutputIs: null },
    { whenInputIs: 'some text', expectedOutputIs: null },
    { whenInputIs: '-30', expectedOutputIs: null },
    { whenInputIs: -30.93, expectedOutputIs: null },
    { whenInputIs: 0, expectedOutputIs: 0 },
    { whenInputIs: '1some number', expectedOutputIs: 1 },
    { whenInputIs: 1.92, expectedOutputIs: 1.92 },
    { whenInputIs: 192, expectedOutputIs: 192 }
  ];

  tests.forEach( function( test ) {
    it( 'should return ' + test.expectedOutputIs + ' if the input is ' + JSON.stringify( test.whenInputIs ), function() {
      expect( validate.nonNegativeReal( test.whenInputIs ) ).to.equal( test.expectedOutputIs );
    } );
  } );
} );

// Validate non-Negative Integer test cases.
describe( 'nonNegativeReal()', function() {
  var tests = [
    { whenInputIs: undefined, expectedOutputIs: null },
    { whenInputIs: null, expectedOutputIs: null },
    { whenInputIs: '', expectedOutputIs: null },
    { whenInputIs: '    ', expectedOutputIs: null },
    { whenInputIs: 'some text', expectedOutputIs: null },
    { whenInputIs: '-30', expectedOutputIs: null },
    { whenInputIs: -30, expectedOutputIs: null },
    { whenInputIs: 1.92, expectedOutputIs: null },
    { whenInputIs: 0, expectedOutputIs: 0 },
    { whenInputIs: '1some number', expectedOutputIs: 1 },
    { whenInputIs: 192, expectedOutputIs: 192 }
  ];

  tests.forEach( function( test ) {
    it( 'should return ' + test.expectedOutputIs + ' if the input is ' + JSON.stringify( test.whenInputIs ), function() {
      expect( validate.nonNegativeInt( test.whenInputIs ) ).to.equal( test.expectedOutputIs );
    } );
  } );
} );

// Validate mobile number from INdia test cases.
describe( 'mobileIN()', function() {
  var tests = [
    { whenInputIs: '', expectedOutputIs: null },
    { whenInputIs: '   ', expectedOutputIs: null },
    { whenInputIs: 'pappu@lost.', expectedOutputIs: null },
    { whenInputIs: '100', expectedOutputIs: null },
    { whenInputIs: '+911149236546', expectedOutputIs: null },
    { whenInputIs: '68110898110', expectedOutputIs: null },
    { whenInputIs: ' 9811098110 ', expectedOutputIs: '9811098110' },
    { whenInputIs: ' 09811098110 ', expectedOutputIs: '09811098110' },
    { whenInputIs: ' +919811098110 ', expectedOutputIs: '+919811098110' },
    { whenInputIs: ' 8811098110   ', expectedOutputIs: '8811098110' },
    { whenInputIs: ' 7811098110   ', expectedOutputIs: '7811098110' },
    { whenInputIs: ' +917811098110   ', expectedOutputIs: '+917811098110' }
  ];

  tests.forEach( function( test ) {
    it( 'should return ' + test.expectedOutputIs + ' if the input is ' + JSON.stringify( test.whenInputIs ), function() {
      expect( validate.mobileIN( test.whenInputIs ) ).to.equal( test.expectedOutputIs );
    } );
  } );

  errors.forEach( function( error ) {
    it( 'should return ' + error.expectedOutputIs + ' if the input is ' + JSON.stringify( error.whenInputIs ), function() {
      expect( validate.mobileIN.bind( null, error.whenInputIs ) ).to.throw( error.expectedOutputIs );
    } );
  } );
} );

// Validate date test cases.
describe( 'date()', function() {
  var tests = [
    { whenInputIs: [ '///' ], expectedOutputIs: null },
    { whenInputIs: [ '2016/11/' ], expectedOutputIs: null },
    { whenInputIs: [ '2016/11//' ], expectedOutputIs: null },
    { whenInputIs: [ '2016//11/' ], expectedOutputIs: null },
    { whenInputIs: [ '//11/' ], expectedOutputIs: null },
    { whenInputIs: [ '15/07/47' ], expectedOutputIs: '194707150000' },
    { whenInputIs: [ '15/07/15' ], expectedOutputIs: '201507150000' },
    { whenInputIs: [ '5/07/2047' ], expectedOutputIs: '204707050000' },
    { whenInputIs: [ '15/7/1915' ], expectedOutputIs: '191507150000' },
    { whenInputIs: [ '15/7/1915 1:30' ], expectedOutputIs: '191507150130' },
    { whenInputIs: [ '15/7/1915 11:30' ], expectedOutputIs: '191507151130' },
    { whenInputIs: [ '15/7/1915 11:5' ], expectedOutputIs: '191507151105' },
    { whenInputIs: [ '15/7/1915 11:5', [] ], expectedOutputIs: '191507151105' },
    { whenInputIs: [ '15/7/19 11:5', [ 'yymmdd' ] ], expectedOutputIs: '201507191105' }
  ];

  tests.forEach( function( test ) {
    it( 'should return ' + test.expectedOutputIs + ' if the input is ' + JSON.stringify( test.whenInputIs ), function() {
      expect( validate.date.apply( null, test.whenInputIs ) ).to.equal( test.expectedOutputIs );
    } );
  } );

  errors.slice( 0, 2 ).forEach( function( error ) {
    it( 'should return ' + error.expectedOutputIs + ' if the input is ' + JSON.stringify( error.whenInputIs ), function() {
      expect( validate.date.bind( null, error.whenInputIs ) ).to.throw( error.expectedOutputIs );
    } );
  } );
} );
