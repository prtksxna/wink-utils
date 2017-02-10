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
// ### Internal functions

// #### Value

// Returns the value from `data` according to `accessor`, that may be a property
// of object contained in array or a function that returns the required value.
var value = function ( data, accessor ) {
  return (
    ( accessor === undefined ) ? data :
      ( typeof accessor === 'function' ) ? accessor( data ) : data[ accessor ]
  );
}; // value()

// #### Distribution

// Internal function to compute distribution from `bin` and `binWidth`.
var distribution = function ( bins, binWidth, sortedData, rs, precision, accessor ) {
  // Helpers.
  var cutoff, i, k, limit, mid, min;
  // Hold x axis and y axis values.
  var x, y;


  // Find distribution now.
  x = new Array( bins );
  y = new Array( bins );
  cutoff = new Array( bins );
  limit = +( rs.min + binWidth ).toFixed( precision );
  min = +( rs.min ).toFixed( precision );
  for ( i = 0; i < bins; i += 1 ) {
   y[ i ] = 0;
   mid = ( limit - ( binWidth / 2 ) ).toFixed( precision );
   x[ i ] = { min: min, mid: mid, max: limit };
   cutoff[ i ] = limit;
   min = +( min + binWidth).toFixed( precision );
   limit = +( limit + binWidth).toFixed( precision );
  }
  i = 0;
  for ( k = 0; k < bins; k += 1 ) {
    // > TODO: Make it faster by deploying binary search approach.
    for ( ; ( ( i < rs.size ) && ( value( sortedData[ i ], accessor ) <= cutoff[ k ] ) ); i += 1 ) {
      y[ k ] += 1;
    }
  }
  return ( { classes: x, freq: y } );
}; // distribution()

// ### Utilities Name Space

// Create utilities name space.
var utilities = Object.create( null );

// ### Utilities.probability name space

// Name space for all probability computations.
utilities.probability = Object.create( null );

// #### Range for CI

// Computes the probaibility along with **range** for the CI i.e. `z` from the
// observed count of successes (`successCount`) out of the total count (`totalCount`).
// The range is specified in terms of minimum and maximum probaibility values.
// These computations are based on approach specified in the Wilson's *Notes on
// Probable Inference, The Law of Succession, and Statistical Inference*
// published in ASA's Journal.
//
// For quick reference, typical value of `z` for 90% and 95% CI is approximately
// 1.96 and 1.65 respectively.
utilities.probability.range4CI = function ( successCount, totalCount, z ) {
  var t = ( z * z ) / totalCount;
  var p0 = successCount / totalCount;
  var q0 = 1 - p0;
  var delta = Math.sqrt( ( p0 * q0 * t ) + ( ( t * t ) / 4 ) );

  var min = ( p0 + ( t / 2 ) - delta ) / ( t + 1 );
  var max = ( p0 + ( t / 2 ) + delta ) / ( t + 1 );

  return {
    probability: ( p0 + ( t / 2 ) ) / ( t + 1 ),
    min: min,
    max: max
  };
}; // range4CI()

// #### Combine

// Combines two probability estimates (`pa1` and `pa2`) about the occurrence of
// a **single** event **a**. It returns the aggregated probability of occurrence
// of the event **a**. The assumption here is that the two probabilities
// (estimates) are not correlated with each other.
utilities.probability.combine = function ( pa1, pa2 ) {
  return ( ( pa1 * pa2 ) / ( ( pa1 * pa2 ) + ( ( 1 - pa1 ) * ( 1 - pa2 ) ) ) );
}; // combine()

// #### Add

// Adds probabilities (`pa` and `pb`) of two non-mutually exclusive events
// **a** and **b**.
utilities.probability.add = function ( pa, pb ) {
  return ( ( pa + pb ) - ( pa * pb ) );
}; // add()

// ### Utilities pValue name space

// Name space for different pValue computations.
utilities.pValue = Object.create( null );

// #### chi2

// Computes the p value for the chi2 statistic - `x2` and degree of freedom - `df`.
utilities.pValue.chi2 = function ( x2, df ) {
  var i, j, k, p1, p2;
  if ( df === 1 && x2 > 999 ) {
    return 0;
  }

  if ( x2 > 999 || df > 999 ) {
    p1 = utilities.pValue.chi2( ( x2 - df ) * ( x2 - df ) / ( 2 * df ), 1 ) / 2;
    if ( x2 > df ) {
      return p1;
      // eslint-disable-next-line
    } else {
      return ( 1 - p1 );
    }
  }

  p2 = Math.exp( -0.5 * x2 );
  if ( ( df % 2 ) === 1 ) {
    p2 *= Math.sqrt( 2 * x2 / Math.PI );
  }
  for ( i = df; i >= 2; p2 *= x2 / i, i -= 2 );
  for ( k = p2, j = df; k > 0.0000000001 * p2; j += 2, k *= x2 / j, p2 += k );
  return ( 1 - p2 );
}; // chi2()

// ### Utilities.Stats name space

// Name space for basic stats.
utilities.stats = Object.create( null );

// ### Utilities.Stats.Streaming name space

// Name space for all streaming computations; some of these utilities will also
// be available under stats directly as non-streaming one!
//
// Not to be confused with nodejs streams.
//
// All streaming functions are **higher order functions**. Every streaming
// function returns 2 functions viz. (a) `compute` and (b) `probeResults`. The
// `compute` function receives one input at a time and incemenatally performs the
// target computation; whereas the `probeResults` function allows to proble the
// results at any stage!
utilities.stats.streaming = Object.create( null );

// #### Basic

// Returns a function that computes the full set of basic stats. This returned
// function performs computation on stream of data via `di`.
// > TODO: complete balance computations & update comments
utilities.stats.streaming.basic = function () {
  var mean = 0;
  var min = Infinity;
  var max = -Infinity;
  var varianceXn = 0;
  var items = 0;
  return ( {
    compute: function ( di ) {
      var prevMean;
      items += 1;
      prevMean = mean;
      mean += ( di - mean ) / items;
      min = ( min > di ) ? di : min;
      max = ( max < di ) ? di : max;
      varianceXn += ( di - prevMean ) * ( di - mean );
      return undefined;
    },
    probeResults: function () {
      return { n: items, min: min, mean: mean, max: max, varianceXn: varianceXn };
    }
  } );
}; // basic()

// #### Vital Few

// Returns a function that computes the count of vita few elements in from the
// stream of count data sent via `di`.
utilities.stats.streaming.vitalFew = function ( ) {
  var ss = 0;
  var total = 0;
  return ( {
    compute: function ( di ) {
      total += di;
      ss += ( di * di );
      return undefined;
    },
    probeResults: function () {
      return ( Math.floor( ( total * total ) / ss ) );
    }
  } );
}; // vitalFew()

// ### Utilities.Stats.Robust name space

// Name space for all robust stats like median etc.
utilities.stats.robust = Object.create( null );

// #### Percentile

// Returns the `q`th percentile from the `sortedData`. The computation method is
// similar to MINITAB/SAS IV method. Note: MINITAB/SAS are registered trademarks
// of their respective owners and *decisively* or GRAYPE has no direct or indirect
// association with them.
//
// The value `q` must be between 0 and 1 and data (`sortedData`) must be
// presented in a sorted - ascending manner.
utilities.stats.robust.percentile = function ( sortedData, q, accessor ) {
  // Temp variables to hold dec and int part of count*quartile respectively;
  // j_1 is `j - 1`.
  //
  // eslint-disable-next-line
  var g, j, j_1;
  // Data length - n plus 1.
  var nP1 = sortedData.length + 1;
  // The np1 x quartile - for above computation.
  var nq = nP1 * q;
  // Compute percentile.
  j = Math.floor( nq );
  g = ( nq - j ).toFixed( 2 );
  // eslint-disable-next-line
  j_1 = Math.max( 0, ( j - 1 ) );
  j = Math.min( j, ( sortedData.length - 1 ) );
  return ( ( ( 1 - g ) * value( sortedData[ j_1 ], accessor ) ) + ( g * value( sortedData[ j ], accessor ) ) );
}; // percentile()

// #### Five Number Summary

// Computes min/q1/q2/q3/max from the `sortedData` using `percentile()` method.
// Additionally it also computes `iqr`, `range` and `size`. It is highly
// desirable that the data at least contains 4 or more values.
utilities.stats.robust.fiveNumSummary = function ( sortedData, accessor ) {
  var q1 = utilities.stats.robust.percentile( sortedData, 0.25, accessor );
  var q2 = utilities.stats.robust.percentile( sortedData, 0.50, accessor );
  var q3 = utilities.stats.robust.percentile( sortedData, 0.75, accessor );
  var min = value( sortedData[ 0 ], accessor );
  var size = sortedData.length;
  var max = value( sortedData[ size - 1 ], accessor );

  return ( {
    min: min,
    q1: q1,
    q2: q2,
    q3: q3,
    max: max,
    iqr: ( q3 - q1 ),
    range: ( max - min ),
    size: size
  } );
}; // fiveNumSummary()

// #### Median Absolute Deviation (MAD)

// Computes **mad** and **mean** from the `sortedData` and the `rs` (robust stats,
// obtained from fiveNumSummary). It returns the updated `rs` with mad and mean values.
utilities.stats.robust.mad = function ( sortedData, rs, accessor ) {
  // Absolute Difference From Median.
  var adfm = new Array( rs.size );
  var mean = 0;
  var di;
  for ( var i = 0; i < rs.size; i += 1 ) {
      di = value( sortedData[ i ], accessor );
      adfm[ i ] = Math.abs( di - rs.q2 );
      mean += ( di - mean ) / ( i + 1 );
  }
  adfm.sort( function ( a, b ) {
    return ( a - b );
  } );
  // Compute mad from the median of adfm now and update `rs`. Note, no accessor
  // is required for `adfm`.
  rs.mad = utilities.stats.robust.percentile( adfm, 0.50 );
  rs.mean = mean;
  // Now `rs` has **mean** and **mad** both.
  return ( rs );
}; // mad()

// #### Box Plot

// Performs complete box plot analysis using the robust stats (`rs`) computed via
// `fiveNumSummary`. The `coef` is used for outliers computation and defaults to
// **1.5**. It adds the left and right outliers and also the notches for median
// (`q2`). Each outlier, if present, contains the count, fence and begin/end indexes
// to array for easy extraction of exact values.
utilities.stats.robust.boxPlot = function ( sortedData, rs, coeff, accessor ) {
  var coef = Math.abs( coeff || 1.5 );
  var i;
  var iqrXcoef = rs.iqr * coef;
  var leftFence = rs.q1 - iqrXcoef;
  var leftOutliers, rightOutliers;
  var rightFence = rs.q3 + iqrXcoef;

  var ci = ( 1.58 * rs.iqr ) / ( Math.sqrt( rs.size ) );
  // Compute outliers only and only if `iqrXcoef` is greater than `0`, because
  // with `iqrXcoef` as `0`, fences will become `q1` and `q3` respectively!
  if ( iqrXcoef > 0 ) {
    // Compute Left outliers, if any.
    for ( i = 0; value( sortedData[ i ], accessor ) < leftFence; i += 1 ) ;
    leftOutliers = { begin: 0, end: ( i - 1 ), count: i, fence: value( sortedData[ i ], accessor ) };
    // Compute right outliers, if any.
    for ( i = rs.size - 1; value( sortedData[ i ], accessor ) > rightFence; i -= 1 ) ;
    rightOutliers = { begin: ( i + 1 ), end: ( rs.size - 1 ), count: ( rs.size - i - 1 ), fence: value( sortedData[ i ], accessor ) };
    // Add left and/or right outliers to `rs`.
    if ( leftOutliers.count ) rs.leftOutliers = leftOutliers;
    if ( rightOutliers.count ) rs.rightOutliers = rightOutliers;
  }
  // Add notches.
  rs.leftNotch = rs.q2 - ci;
  rs.rightNotch = rs.q2 + ci;
  return ( rs );
}; // boxPlot()

// ### Utilities.Stats.Histogram name space

// Name space for different histogram generators.
utilities.stats.histogram = Object.create( null );

// #### Smart

// Generates histogram using Freedman–Diaconis method. The `rs` should at least
// contain `fiveNumSummary`. If IQR & MAD both are `0` then it automatically
// downgrades to Sturges' Rule while ensuring minimum 5 bins are maintained.
// The `dataPrecision` is of the `sortedData`, i.e. the minumum number of decimal
// places observed in the data. It attempts to reduce the sparsity of distribution,
// if any, by recomputing the number of bins using Sturges' Rule.
utilities.stats.histogram.smart = function ( sortedData, rs, dataPrecision, accessor ) {
  // Number of bins.
  var bins;
  // Class interval or bin width.
  var binWidth = rs.iqr;
  // Hold x axis and y axis values.
  // var x, y, cutoff;
  // Helpers.
  // var i, k, max, limit, min, mid;
  // The `precision` is extremely important to get a quality histogram - in terms
  // of number of classes and counting data points in a class interval.
  var precision = Math.round( Math.abs( dataPrecision || 0 ) );
  // Compute `bins` and `binWidth`.
  if ( ( binWidth === 0 ) ) {
    if ( rs.mad !== undefined ) utilities.stats.robust.mad( sortedData, rs, accessor );
    binWidth = 2 * rs.mad;
  }

  if ( binWidth > 0 ) {
    // Apply Freedman–Diaconis formula.
    binWidth = 2 * binWidth * Math.pow( rs.size, -( 1 / 3 ) );
    // Adjust `binWidth` according to the `precision`.
    binWidth = +binWidth.toFixed( precision );
    if ( binWidth === 0 ) binWidth = 1;
    bins = Math.ceil( rs.range / binWidth );
  } else {
    // Nothing is working out, downgrade to Sturges' Rule, but ensure minimum 5 bins.
    bins = Math.max( Math.ceil( Math.log2( rs.size ) + 1 ), 5 );
    binWidth = rs.range /  bins;
    // Adjust `binWidth` according to `precision` and recompute everything.
    binWidth = +binWidth.toFixed( precision );
    if ( binWidth === 0 ) binWidth = 1;
    bins = Math.ceil( rs.range / binWidth );
  }
  rs.histogram = distribution( bins, binWidth, sortedData, rs, precision, accessor );
  // Check how sparse is the distribution - # of 0s > 20% of the total frequencies.
  // If yes then attempt its reduction by using the Sturges' Rule (as above).
  // > TODO: Optimize the if condition by checking which rule was used earlier.
  //
  // eslint-disable-next-line
  if ( rs.histogram.freq.filter( function ( e ) { return ( e === 0 ); } ).length > rs.histogram.freq.length * 0.20 ) {
    bins = Math.max( Math.ceil( Math.log2( rs.size ) + 1 ), 5 );
    binWidth = rs.range /  bins;
    binWidth = +binWidth.toFixed( precision );
    if ( binWidth === 0 ) binWidth = 1;
    bins = Math.ceil( rs.range / binWidth );
    rs.histogram = distribution( bins, binWidth, sortedData, rs, precision, accessor );
  }
  return ( rs );
}; // smart()

module.exports = utilities;
