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
// ###Similarity Name Space

// Create similarity name space.
var similarity = Object.create( null );

// ###Similarity.Set Name Space

// Create similarity.set name space.
similarity.set = Object.create( null );

// ####Jaccard

// Computes the Jaccard Similarity Index between input sets `sa` and `sb`. This
// index is always between 0 and 1.
similarity.set.jaccard = function ( sa, sb ) {
  var intersectSize = 0;
  // Use smaller sized set for iteration.
  if ( sa.size < sb.size ) {
    sa.forEach( function ( element ) {
      if ( sb.has( element ) ) intersectSize += 1;
    } );
  } else {
    sb.forEach( function ( element ) {
      if ( sa.has( element ) ) intersectSize += 1;
    } );
  }
  // Compute Jaccard similarity and return.
  return ( intersectSize / ( sa.size + sb.size - intersectSize ) );
}; // jaccard()

// ####Tversky

// Computes the Tversky Similarity Index between input sets `sa` and `sb`, using
// parameters `alpha` and `beta`. Tversky calls `sa` as **prototype** and `sb` as
// **variant**. The `alpha` corresponds to the weight of prototype, whereas `beta`
// corresponds to the weight of variant. Jaccard Similarity is a special case,
// where `alpha = 1` and `beta = 1`. Dice Similarity is also a special case, where
// `alpha = 0.5` and `beta = 0.5`; this defaults to Dice if parameters are not
// specified.
similarity.set.tversky = function ( sa, sb, alpha, beta ) {
  var a, b;
  var intersectSize = 0;
  var saMinusSBsize, sbMinusSAsize;
  a = ( alpha === undefined ) ? 0.5 : alpha;
  b = ( beta === undefined ) ? 0.5 : beta;
  // Use smaller sized set for iteration.
  if ( sa.size < sb.size ) {
    sa.forEach( function ( element ) {
      if ( sb.has( element ) ) intersectSize += 1;
    } );
  } else {
    sb.forEach( function ( element ) {
      if ( sa.has( element ) ) intersectSize += 1;
    } );
  }
  saMinusSBsize = sa.size - intersectSize;
  sbMinusSAsize = sb.size - intersectSize;
  // Compute Tversky similarity and return.
  return ( intersectSize / ( intersectSize + ( a * saMinusSBsize) + ( b * sbMinusSAsize ) ) );
}; // tversky()

// ###Similarity.bow Name Space

// Create similarity.bow name space.
similarity.bow = Object.create( null );

// ####Cosine

// Computes the cosine similarity between the input bows `a` and `b` and returns
// a value between 0 and 1; 0 means no similarity whereas 1 means a perfect one!
similarity.bow.cosine = function ( a, b ) {
  // `ab` & `ba` additional variables are required as you dont want to corrupt
  // `a` & `b`!
  // Updated `a` with words in `b` set as 0 in `a`.
  var ab = Object.create( null );
  // Updated `b` with words in `a` set as 0 in `b`.
  var ba = Object.create( null );
  var w; // a word!

  // Fill up `ab` and `ba`
  // eslint-disable-next-line guard-for-in
  for ( w in a ) {
    ab[ w ] = a[ w ];
    ba[ w ] = 0;
  }
  // eslint-disable-next-line guard-for-in
  for ( w in b ) {
    ba[ w ] = b[ w ];
    ab[ w ] = ab[ w ] || 0;
  }

  // With `ab` & `ba` in hand, its easy to transform in to
  // vector: its a frequency of each word found in both strings
  // We do not need to store these vectors in arrays, instead we can perform
  // processing in the same loop.
  var sa2 = 0,  // sum of ai^2
      saxb = 0, // sum of ai x bi
      sb2 = 0,  // sum of bi^2
      va, vb;  // value of ai and bi
  // One could have used `ba`, as both have same words now!
  // eslint-disable-next-line guard-for-in
  for ( w in ab ) {
    va = ab[ w ];
    vb = ba[ w ];
    sa2 += va * va;
    sb2 += vb * vb;
    saxb += va * vb;
  }

  // Return cosine similarity; ensure you dont get `NaN i.e. 0/0` by testing for
  // `sa2` and `sb2`.
  return ( ( sa2 && sb2 ) ? ( saxb / ( Math.sqrt( sa2 ) * Math.sqrt( sb2 ) ) ) : 0 );
}; // cosine()

// Export similarity.
module.exports = similarity;
