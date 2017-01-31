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
var ncrgx = require( './name_cleaner_regexes.js' );
var porter2Stemmer = require( './porter2_stemmer.js' );

// ###Prepare Name Space

// Create prepare name space.
var prepare = Object.create( null );

// ####Create Index

// Used in creating the index for ngrams and bows.
prepare.createIndex = function () {
  return ( Object.create( null ) );
}; // createIndex()

// ###Prepare.String Name Space

// Create prepare.string name space.
prepare.string = Object.create( null );

// ####LowerCase

// Converts the input string `s` to lower case.
prepare.string.lowerCase = function ( s ) {
  return ( s.toLowerCase() );
}; // lowerCase()

// ####UpperCase

// Converts the input sting `s` to upper case.
prepare.string.upperCase = function ( s ) {
  return ( s.toUpperCase() );
}; // upperCase()

// ####Trim

// Trims leading and trailing spaces from the input string `s`.
prepare.string.trim = function ( s ) {
  return ( s.trim() );
}; // trim()

// ####Remove Extra Spaces

// Removes leading & trailing whitespaces, extra in-between spaces from the input
// string `s`.
prepare.string.removeExtraSpaces = function ( s ) {
  return ( s
            .trim()
            .replace( rgx.spaces, ' ')
         );
}; // removeExtraSpaces()

// ####Retain Alpha-numerics

// Retains only apha, numerals, and spaces and removes all other characters from
// the input string `s`.
prepare.string.retainAlphaNums = function ( s ) {
  return ( s
            .toLowerCase()
            .replace( rgx.notAlphaNumeric, ' ')
            .replace( rgx.spaces, ' ')
            .trim()
          );
}; // retainAlphaNums()

// ####Extract Person's Name

// Attemts to extract person's name from input string `s` in formats like
// **Dr. Ashwini Kumar Sharma B. Tech., M. Tech., PhD. - Electrical** by dropping
// the titles and degrees.
// It assmues the following name format:
// `[<salutations>] <name part in FN, MN, LN> [<degrees>]`.
prepare.string.extractPersonsName = function ( s ) {
  // Remove Degrees by making the list of indexes of each degree and subsequently
  // finding the minimum and slicing from there!
  var indexes = ncrgx.degrees.map( function ( r ) {
    var m = r.exec( s );
    return ( m ) ? m.index : 999999;
  } );
  var sp = Math.min.apply( null, indexes );

  // Generate an Array of Every Elelemnt of Name (e.g. title, first name,
  // sir name, honours, etc)
  var aeen = s.slice( 0, sp ).replace( rgx.notAlpha, ' ').replace( rgx.spaces, ' ').trim().split(' ');
  // Remove titles from the beginning.
  while ( aeen.length && ncrgx.titles.test( aeen[0] ) ) aeen.shift();
  return aeen.join(' ');
}; // extractPersonsName()

// ####Extract Run of Capital Words

// Returns an array of **run of captial words** from thr input string `s`,
// if any; otherwise returns `null`.
prepare.string.extractRunOfCapitalWords = function ( s ) {
  return s.match( rgx.rocWords );
}; // extractRunOfCapitalWords()

// ####Remove Punctuations

// Removes punctuations from the input string `s` by replacing each one of them
// by a single space character.
prepare.string.removePunctuations = function ( s ) {
  return s.replace( rgx.punctuations, ' ' );
}; // removePunctuations()

// #### Remove Special Chars

// Removes special characters from the input string `s`.
prepare.string.removeSplChars = function ( s ) {
  return s.replace( rgx.splChars, ' ' );
}; // removeSplChars()

// ####Remove Elisions

// Removes elisions from the input string `s`.
prepare.string.removeElisions = function ( s ) {
  return ( s
            .replace( rgx.elisionsSpl, '$2' )
            .replace( rgx.elisions1, '$1' )
            .replace( rgx.elisions2, '$1' )
         );
}; // removeElisions()

// ####Split Elisions

// Splits elisions from the input string `s` by inserting a space.
prepare.string.splitElisions = function ( s ) {
  return ( s
            .replace( rgx.elisionsSpl, '$2 $3' )
            .replace( rgx.elisions1, '$1 $2' )
            .replace( rgx.elisions2, '$1 $2' )
         );
}; // splitElisions()

// ####Amplify Not Elision

// Amplifies the not elision by replacing it by the word **not** in the input string `s`;
// it must be used before calling the `removeElisions()`.
prepare.string.amplifyNotElision = function ( s ) {
  return s.replace( rgx.notElision, '$1 not' );
}; // amplifyNotElision()

// ####Marker

// Generate a **marker** for the input string `s` - an 1-gram sorted and joined back as
// string again; it is useful for in determining a quick but approximate degree
// of match between short strings (with potentially more false positives).
prepare.string.marker = function ( s ) {
  var uniqChars = Object.create( null );
  for ( var i = 0, imax = s.length; i < imax; i += 1 ) {
    uniqChars[ s[ i ] ] = true;
  }
  return ( Object.keys( uniqChars ).sort().join('') );
}; // marker()

// ####N-Gram

// Generates the `ng` N-gram from the input string `s`.
prepare.string.ngram = function ( s, ng ) {
  var ngBOW = Object.create( null ),
      tg;
  for ( var i = 0, imax = s.length; i < imax; i += 1 ) {
    tg = s.slice( i, i + ng );
    if ( tg.length === ng ) ngBOW[ tg ] = 1 + ( ngBOW[ tg ] || 0 );
  }
  return ( ngBOW );
}; // ngram()

// #### N-Gram with Index

// Generates the N-gram from the input string `s`, while updating the `ngIndex` using
// the generated ngrams with `k` - the string's index.
// The `ngIndex` should be created using `prepare.createIndex()` and must be
// passed as an argument with every call.
prepare.string.ngramWithIndex = function ( s, ng, k , ngIndex ) {
  var ngBOW = Object.create( null ),
      tg;
  for ( var i = 0, imax = s.length; i < imax; i += 1 ) {
    tg = s.slice( i, i + ng );
    if ( tg.length === ng ) {
      ngBOW[ tg ] = 1 + ( ngBOW[ tg ] || 0 );
      ngIndex[ tg ] = ngIndex[ tg ] || [];
      ngIndex[ tg ].push( k );
    }
  }
  return ( ngBOW );
}; // ngramWithIndex()

// #### sentences

// Splits the text contained in the input string `s` into sentences returned
// in form of an array. Note, the end-of-sentence punctuations are retained in
// each of the sentence. It can handle sentences started from numeric values as
// well, though it is not a good english practice.
// It uses `~` as the `splChar` for splitting and therefore
// it must not be present in the input string; you may give another `splChar`
// as the second argument.
prepare.string.sentences = function ( s, splChar ) {
  var splCh = splChar || '~';
  var substitute = '$1' + splCh;
  return ( s
            .replace( '...', '…' )
            .replace( rgx.eosPunctuations, substitute )
            .split( splCh )
            .map( prepare.string.trim )
         );
}; // sentences()

// #### tokenize0

// Quick & dirty tokenizer by splitting the input string `s` on non-words.
// This means tokens would consists of only alphas, numerals and underscores;
// all other characters will be stripped as they are treated as separators.
prepare.string.tokenize0 = function ( s ) {
  var tokens = s.split( rgx.nonWords );
  // Need to check the 0th and last element of array for empty string because if
  // fisrt/last characters are non-words then these will be empty stings!
  if ( tokens[ 0 ] === '' ) tokens.shift();
  if ( tokens[ tokens.length - 1 ] === '' ) tokens.pop();
  return tokens;
}; // tokenize0()

// #### tokenize

// Tokenizes the input string `s` while retaining (a) `. , -` punctuations that
// are part of numbers, (b) currency symbols, and (c) `_`
// Prior to tokenization, it removes all ellisions but n't and amplifies it to
// **not**.
prepare.string.tokenize = function ( s ) {
  return ( prepare.string.removeElisions( prepare.string.amplifyNotElision( s ) )
            .replace( rgx.nonNumPunctuations, ' ' )
            .replace( rgx.otherPunctuations, ' ' )
            .replace( rgx.splChars, ' ' )
            // This will ensure currency symbol becomes separate token.
            .replace( rgx.currency, ' $& ')
            .replace( rgx.spaces, ' ' )
            .trim()
            .replace( /\.$/, '' )
            .split( ' ' )
         );
}; // tokenize()

// #### stem

// Stems the input string using Porter V2 stemmer. Details in `porter2_stemmer.js`
// file.
prepare.string.stem = porter2Stemmer;

// ###Prepare.Tokens Name Space

// Create prepare.tokens name space.
prepare.tokens = Object.create( null );

// #### stem

// Stems the input token `t` using `string.stem()`.
prepare.tokens.stem = function ( t ) {
  return t.map( prepare.string.stem );
};

// Export prepare.
module.exports = prepare;
