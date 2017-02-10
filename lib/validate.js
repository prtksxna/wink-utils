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
var rgx = require( './util_regexes.js' );
var prepare = require( './prepare_text.js' );


// Given Format to Internal format mapping for `date()`.
var f2i = {
  yymmdd: { y: 0, m: 1, d: 2, hh: 3, mm: 4 },
  ddmmyy: { d: 0, m: 1, y: 2, hh: 3, mm: 4 },
};

// ### Validate Name Space

// Create validate name space.
var validate = Object.create( null );

// #### Number with som

// Parses the input string `s` containg a numeric value followed by the
// scale of measurement (som) and retunrs an object containing parsed
// components, provided the numeric value is valid; otherwise returns `null`.
// Example: `'1.23 cms'` will return `{ num: 1.23, som: 'cms' }`.
validate.numberWithSOM = function ( s ) {
  var num = parseFloat( s );
  num =  ( !isNaN( num ) && isFinite( num ) ) ?
                ( ( num >= 0 ) ? num : null ) :
                null;
  if ( num === null ) return null;
  var text = rgx.separateNumAndText.exec( s );
  var som = ( text && ( text.length === 3 ) ) ? text[ 2 ] : '';
  return { num: num, som: som };
}; // numberWithSOM()

// #### EMail

// Returns trimmed and lower cased input string `s` if it is a valid e-mail id
// otherwise returns `null`.
validate.email = function ( s ) {
  var sl = prepare.string.removeExtraSpaces( prepare.string.lowerCase( s ) ); // convert to lower case and remove extra white spaces
  return ( rgx.email.test( sl ) ? sl : null );
}; // email()

// #### Non-negative Real

// Converts input string `s` to number if it is a valid no negative real
// otherwise returns `null`.
validate.nonNegativeReal = function ( s ) {
  var floatNum = parseFloat( s );
  floatNum =  ( !isNaN( floatNum ) && isFinite( floatNum ) ) ?
                ( ( floatNum >= 0 ) ? floatNum : null ) :
                null;
  return ( floatNum );
}; // nonNegativeReal()

// #### Non-Negative Integer
// Converts input string `s` to number if it is a valid no negative integer
// otherwise returns `null`.
validate.nonNegativeInt = function ( s ) {
  var intNum = parseInt( s, 10 );
  intNum =  ( !isNaN( intNum ) && isFinite( intNum ) && ( intNum === parseFloat(s) ) ) ?
              ( ( intNum >= 0 ) ? intNum : null ) :
              null;
  return ( intNum );
}; // nonNegativeInt()

// #### Mobile IN

// Returns trimmed and lower cased input string `s` if it is a valid indian (IN)
// mobile #, otherwise returns `null`.
validate.mobileIN = function ( s ) {
  var sl = prepare.string.removeExtraSpaces( s );
  return ( rgx.mobileIndian.test( sl ) ? sl : null );
}; // mobileIN()

// #### Date

// Converts input string `s` to internal date format according to `params`, which
// can be either `ddmmyy` or `mmddyy`; if `s` is invalid then it returns null.
// > TODO: stronger validation etc. consider using external utility like moment.js.
validate.date = function ( s , params ) {
  var format = ( params ) ? (params[ 0 ] || 'ddmmyy') : 'ddmmyy';
  var ifmt = f2i[ format ]; // internal format i.e. yyyymmddhhmm
  var matches = s.match( rgx.date );

  if ( !matches ) return null;
  var y = matches[ ifmt.y ]; // year
  var m = matches[ ifmt.m ]; // month
  var d = matches[ ifmt.d ]; // date
  var hh = matches[ ifmt.hh ]; // hours 24 hour format ***ASSUMED***
  var mm = matches[ ifmt.mm ]; // mins

  if ( ( y === undefined ) || ( m === undefined ) || ( d === undefined ) ) { // handle error situation
    return ( null );
  }

  var cy = ( new Date().getFullYear() );
  var century = Math.floor( cy / 100 );
  y = ( y.length === 2 ) ?
        ( ( +y > ( cy % 100 ) ) ? ( century - 1 ).toString() + y : century.toString() + y ) : y;
  m = ( m.length === 1 ) ? '0' + m : m;
  d = ( d.length === 1 ) ? '0' + d : d;

  hh = ( hh ) ? ( ( hh.length === 1 ) ? '0' + hh : hh ) : '00';
  mm = ( mm ) ? ( ( mm.length === 1 ) ? '0' + mm : mm ) : '00';

  return ( y + m + d + hh + mm );
}; // date ()

// Export validate.
module.exports = validate;
