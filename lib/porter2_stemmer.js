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

// Implementation of Porter V2 Algorithm by Dr Martin F Porter.
// Reference: https://snowballstem.org/algorithms/english/stemmer.html

// #### Regex Definitions

// Regex definition of `double`.
var rgxDouble = /(bb|dd|ff|gg|mm|nn|pp|rr|tt)$/;
// Definition for Step Ia suffixes.
var rgxSFXsses = /(.+)(sses)$/;
var rgxSFXiedORies2 = /(.{2,})(ied|ies)$/;
var rgxSFXiedORies1 = /(.{1})(ied|ies)$/;
var rgxSFXusORss = /(.+)(us|ss)$/;
var rgxSFXs = /(.+)(s)$/;
// Definition for Step Ib suffixes.
var rgxSFXeedlyOReed = /(.*)(eedly|eed)$/;
var rgxSFXedORedlyORinglyORing = /([aeiouy].*)(ed|edly|ingly|ing)$/;
var rgxSFXatORblORiz = /(at|bl|iz)$/;
// Definition for Step Ic suffixes.
var rgxSFXyOR3 = /(.+[^aeiouy])([y3])$/;
// Definition for Step II suffixes; note we have spot the longest suffix.
var rgxSFXstep2 = /(ization|ational|fulness|ousness|iveness|tional|biliti|lessli|entli|ation|alism|aliti|ousli|iviti|fulli|enci|anci|abli|izer|ator|alli|bli|ogi|li)$/;
var rgxSFXstep2WithReplacements = [
  // Length 7.
  { rgx: /ational$/, replacement: 'ate' },
  { rgx: /ization$/, replacement: 'ize' },
  { rgx: /fulness$/, replacement: 'ful' },
  { rgx: /ousness$/, replacement: 'ous' },
  { rgx: /iveness$/, replacement: 'ive' },
  // Length 6.
  { rgx: /tional$/, replacement: 'tion' },
  { rgx: /biliti$/, replacement: 'ble' },
  { rgx: /lessli$/, replacement: 'less' },
  // Length 5.
  { rgx: /iviti$/, replacement: 'ive' },
  { rgx: /ousli$/, replacement: 'ous' },
  { rgx: /ation$/, replacement: 'ate' },
  { rgx: /entli$/, replacement: 'ent' },
  { rgx: /(.*)(alism|aliti)$/, replacement: '$1al' },
  { rgx: /fulli$/, replacement: 'ful' },
  // Length 4.
  { rgx: /alli$/, replacement: 'al' },
  { rgx: /ator$/, replacement: 'ate' },
  { rgx: /izer$/, replacement: 'ize' },
  { rgx: /enci$/, replacement: 'ence' },
  { rgx: /anci$/, replacement: 'ance' },
  { rgx: /abli$/, replacement: 'able' },
  // Length 3.
  { rgx: /bli$/, replacement: 'ble' },
  { rgx: /(.*)(l)(ogi)$/, replacement: '$1$2og' },
  // Length 2.
  { rgx: /(.*)([cdeghkmnrt])(li)$/, replacement: '$1$2' }
];
// Definition for Step III suffixes; once again spot the longest one first!
var rgxSFXstep3 = /(ational|tional|alize|icate|iciti|ative|ical|ness|ful)$/;
var rgxSFXstep3WithReplacements = [
  { rgx: /ational$/, replacement: 'ate' },
  { rgx: /tional$/, replacement: 'tion' },
  { rgx: /alize$/, replacement: 'al' },
  { rgx: /(.*)(icate|iciti|ical)$/, replacement: '$1ic' },
  { rgx: /(ness|ful)$/, replacement: '' },
];
// Definition for Step IV suffixes.
var rgxSFXstep4 = /(ement|ance|ence|able|ible|ment|ant|ent|ism|ate|iti|ous|ive|ize|al|er|ic)$/;
var rgxSFXstep4Full = /(ement|ance|ence|able|ible|ment|ant|ent|ism|ate|iti|ous|ive|ize|ion|al|er|ic)$/;
var rgxSFXstep4ion = /(.*)(s|t)(ion)$/;
// Exceptions Set I.
var exceptions1 = {
  // Mapped!
  'skis': 'ski',
  'skies': 'sky',
  'dying': 'die',
  'lying': 'lie',
  'tying': 'tie',
  'idly': 'idl',
  'gently': 'gentl',
  'ugly': 'ugli',
  'early': 'earli',
  'only': 'onli',
  'singly': 'singl',
  // Invariants!
  'sky': 'sky',
  'news': 'news',
  'atlas': 'atlas',
  'cosmos': 'cosmos',
  'bias': 'bias',
  'andes': 'andes'
};
// Exceptions Set II.
// Note, these are to be treated as full words.
var rgxException2 = /^(inning|outing|canning|herring|proceed|exceed|succeed|earring)$/;

// #### Prelude

// Performs in initial pre-processing by transforming thhe input string `s` as
// per the replacements.
var prelude = function ( s ) {
  return ( s
            // Handle y's.
            .replace( /^y/, '3' )
            .replace( /([aeiou])y/, '$13' )
            // Handle apostrophe.
            .replace( /\’s$|\'s$/, '' )
            .replace( /s\’$|s\'$/, '' )
            .replace( /[\’\']$/, '' )
         );
}; // prelude()

// #### Is Short

// Returns `true` if the input string `s` is a short syllable; otherwise it
// returns `false`.
var isShort = function ( s ) {
  // (a) a vowel followed by a non-vowel other than w, x or 3 and
  // preceded by a non-vowel, **or** (b) a vowel at the beginning of the word
  // followed by a non-vowel.
  return (
    (
      (
        ( /[^aeiouy][aeiouy][^aeiouywx3]$/ ).test( s ) ||
        ( /^[aeiouy][^aeiouy]{0,1}$/ ).test( s ) // Removed this new changed??
      )
    )
  );
}; // isShort()

// #### Mark Regions

// Returns the R1 and R2 regions as an object from the input string `s`.
var markRegions = function ( s ) {
  // Matches of R1 and R2.
  var m1, m2;
  // To detect regions i.e. R1 and R2.
  var rgxRegions = /[aeiouy]+([^aeiouy]{1}.+)/;
  m1 = rgxRegions.exec( s );
  if ( !m1 ) return ( { r1: '', r2: '' } );
  m1 = m1[ 1 ].slice( 1 );
  // Handle exceptions here to prevent over stemming.
  m1 = ( /^(gener|commun|arsen)/.test( s ) ) ? s.replace( /^(gener|commun|arsen)(.*)/, '$2') : m1;
  m2 = rgxRegions.exec( m1 );
  if ( !m2 ) return ( { r1: m1, r2: '' } );
  m2 = m2[ 1 ].slice( 1 );
  return ( { r1: m1, r2: m2 } );
}; // markRegions()

// #### Step Ia

// Step Ia.
var step1a = function ( s ) {
  var wordPart;
  if ( rgxSFXsses.test( s ) ) return ( s.replace( rgxSFXsses, '$1ss' ) );
  if ( rgxSFXiedORies2.test( s ) ) return ( s.replace( rgxSFXiedORies2, '$1i' ) );
  if ( rgxSFXiedORies1.test( s ) ) return ( s.replace( rgxSFXiedORies1, '$1ie' ) );
  if ( rgxSFXusORss.test( s ) ) return ( s );
  wordPart = s.replace( rgxSFXs, '$1' );
  if ( /[aeiuouy](.+)$/.test( wordPart ) ) return ( s.replace( rgxSFXs, '$1' ) );
  return ( s );
}; // step1a()

// #### Step Ib

// Step Ib.
var step1b = function ( s ) {
  var rgn = markRegions( s ),
  sd;
  // Search for the longest among the `eedly|eed` suffixes.
  if ( rgxSFXeedlyOReed.test( s ) )
    // Replace by ee if in R1.
    return ( rgxSFXeedlyOReed.test( rgn.r1 ) ? s.replace( rgxSFXeedlyOReed, '$1ee' ) : s );
  // Delete `ed|edly|ingly|ing` if the preceding word part contains a vowel.
  if ( rgxSFXedORedlyORinglyORing.test( s ) ) {
    sd = s.replace( rgxSFXedORedlyORinglyORing, '$1' );
    rgn = markRegions( sd );
    // And after deletion, return either
    return ( rgxSFXatORblORiz.test( sd ) ) ? ( sd + 'e' ) :
            // or
            ( rgxDouble.test( sd ) ) ? ( sd.replace( /.$/, '' ) ) :
              // or
              ( ( isShort( sd ) ) && ( rgn.r1 === '' ) ) ? ( sd + 'e' ) :
                // or
                sd;
  }
  return ( s );
}; // step1b()

// #### Step Ic

// Step Ic.
var step1c = function ( s ) {
  return ( s.replace( rgxSFXyOR3, '$1i') );
}; // step1c()

// #### Step II

// Step II.
var step2 = function ( s ) {
  var i, imax,
      rgn = markRegions( s ),
      us; // updated s.
  var match = s.match( rgxSFXstep2 );
  match = ( match === null ) ? '$$$$$' : match[ 1 ];
  if ( rgn.r1.indexOf( match ) !== -1 ) {
    for ( i = 0, imax = rgxSFXstep2WithReplacements.length; i < imax; i += 1 ) {
      us = s.replace( rgxSFXstep2WithReplacements[ i ].rgx, rgxSFXstep2WithReplacements[ i ].replacement );
      if ( s !== us ) return ( us );
    }
  }
  return ( s );
}; // step2()

// #### Step III

// Step III.
var step3 = function ( s ) {
  var i, imax,
      rgn = markRegions( s ),
      us; // updated s.
  var match = s.match( rgxSFXstep3 );
  match = ( match === null ) ? '$$$$$' : match[ 1 ];

  if ( rgn.r1.indexOf( match ) !== -1 ) {
    for ( i = 0, imax = rgxSFXstep3WithReplacements.length; i < imax; i += 1 ) {
      us = s.replace( rgxSFXstep3WithReplacements[ i ].rgx, rgxSFXstep3WithReplacements[ i ].replacement );
      if ( s !== us ) return ( us );
    }
    if ( /ative/.test( rgn.r2 ) ) return s.replace( /ative$/, '' );
  }
  return ( s );
}; // step3()

// #### Step IV

// Step IV.
var step4 = function ( s ) {
  var rgn = markRegions( s );
  var match = s.match( rgxSFXstep4Full );
  match = ( match === null ) ? '$$$$$' : match[ 1 ];
  if ( rgxSFXstep4Full.test( s ) &&  rgn.r2.indexOf( match ) !== -1 ) {
    return rgxSFXstep4.test( s ) ? s.replace( rgxSFXstep4, '' ) :
    (
      rgxSFXstep4ion.test( s ) ?
      s.replace( rgxSFXstep4ion, '$1$2') :
      s
    );
  }
  return ( s );
}; // step4()

// #### Step V

// Step V.
var step5 = function ( s ) {
  var preceding, rgn;
  // Search for the `e` suffixes.
  rgn = markRegions( s );
  if ( /e$/i.test( s ) ) {
    preceding = s.replace( /e$/, '' );
    return (
              // Found: delete if in R2, or in R1 and not preceded by a short syllable
              /e/.test( rgn.r2 ) || ( /e/.test( rgn.r1 ) && !isShort( preceding ) ) ?
              preceding : s
           );
  }
  // Search for the `l` suffixes.
  if ( /l$/.test( s ) ) {
    rgn = markRegions( s );
    // Found: delete if in R2
    return ( rgn.r2 && ( /l$/ ).test( rgn.r2 ) ? s.replace( ( /ll$/ ), 'l' ) : s );
  }
  // If nothing happens, must return the string!
  return ( s );
}; // step5()

// #### Stem

// The main Porter 2 Stemmer: stems the input string `word` and returns the
// stemmed `word`.
var stem = function ( word ) {
  var str = word.toLowerCase();
  if ( str.length < 3 ) return ( str );
  if ( exceptions1[ str ] ) return ( exceptions1[ str ] );
  str = prelude( str );
  str = step1a( str );

  if ( !rgxException2.test( str ) ) {
    str = step1b( str );
    str = step1c( str );
    str = step2( str );
    str = step3( str );
    str = step4( str );
    str = step5( str );
  }

  str = str.replace( /3/g , 'y' );
  return ( str );
}; // stem()

// Export stem function.
module.exports = stem;
