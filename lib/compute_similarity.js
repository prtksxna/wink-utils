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

// Create prepare.string name space.
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

// Export similarity.
module.exports = similarity;
