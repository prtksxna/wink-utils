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
var objHelpers = require( './object_helpers' );
var arrHelpers = require( './array_helpers' );

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

// ### Stats Name Space

// Create stats name space.
var stats = Object.create( null );

// ### stats.probability name space

// Name space for all probability computations.
stats.probability = Object.create( null );

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
stats.probability.range4CI = function ( successCount, totalCount, z ) {
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
stats.probability.combine = function ( pa1, pa2 ) {
  return ( ( pa1 * pa2 ) / ( ( pa1 * pa2 ) + ( ( 1 - pa1 ) * ( 1 - pa2 ) ) ) );
}; // combine()

// #### Add

// Adds probabilities (`pa` and `pb`) of two non-mutually exclusive events
// **a** and **b**.
stats.probability.add = function ( pa, pb ) {
  return ( ( pa + pb ) - ( pa * pb ) );
}; // add()

// ### Stats.Streaming name space

stats.streaming = Object.create( null );

// Not to be confused with nodejs streams.
//
// All streaming functions are **higher order functions**. Every streaming
// function returns 2 functions viz. (a) `compute` and (b) `result`. The
// `compute` or `count` function receives one input at a time and incemenatally
// performs the target computation/counting; whereas the `result` function
// allows to probe the result at any stage!


// #### min

stats.streaming.min = function () {
  var items = 0;
  var min = Infinity;
  var methods = Object.create( null );

  methods.compute = function ( di ) {
    items += 1;
    min = ( min > di ) ? di : min;
    return undefined;
  }; // compute()

  methods.result = function () {
    return { n: items, min: min };
  }; // result()

  return methods;
}; // min()

// #### max

stats.streaming.max = function () {
  var items = 0;
  var max = -Infinity;
  var methods = Object.create( null );

  methods.compute = function ( di ) {
    items += 1;
    max = ( max < di ) ? di : max;
    return undefined;
  }; // compute()

  methods.result = function () {
    return { n: items, max: max };
  }; // result()

  return methods;
}; // max()

// #### mean

stats.streaming.mean = function () {
  var mean = 0;
  var min = Infinity;
  var max = -Infinity;
  var items = 0;
  var methods = Object.create( null );

  methods.compute = function ( di ) {
    items += 1;
    mean += ( di - mean ) / items;
    min = ( min > di ) ? di : min;
    max = ( max < di ) ? di : max;
    return undefined;
  }; // compute()

  methods.result = function () {
    return { n: items, min: min, mean: mean, max: max };
  }; // result()

  return methods;
}; // mean()

// #### Basic

// Returns a function that computes the full set of basic stats. This returned
// function performs computation on stream of data via `di`.
stats.streaming.basic = function () {
  var mean = 0;
  var min = Infinity;
  var max = -Infinity;
  var varianceXn = 0;
  var items = 0;
  var methods = Object.create( null );

  methods.compute = function ( di ) {
    var prevMean;
    items += 1;
    prevMean = mean;
    mean += ( di - mean ) / items;
    min = ( min > di ) ? di : min;
    max = ( max < di ) ? di : max;
    varianceXn += ( di - prevMean ) * ( di - mean );
    return undefined;
  }; // compute()

  // This returns the sample's variance and standard deviation.
  methods.result = function () {
    var variance = varianceXn / items;
    var stdev = Math.sqrt( variance );
    return { n: items, min: min, mean: mean, max: max, variance: variance, stdev: stdev };
  }; // result()

  // This returns population estimate of variance and standard deviation.
  methods.resultPE = function () {
    var variance = varianceXn / ( items - 1 );
    var stdev = Math.sqrt( variance );
    return { n: items, min: min, mean: mean, max: max, variance: variance, stdev: stdev };
  }; // resultPE()

  return methods;
}; // basic()

// #### Vital Few

// Returns a function that computes the count of vita few elements in from the
// stream of count data sent via `di`.
stats.streaming.vitalFew = function ( ) {
  var ss = 0;
  var total = 0;
  var items = 0;
  var methods = Object.create( null );

  methods.compute = function ( di ) {
    items += 1;
    total += di;
    ss += ( di * di );
    return undefined;
  }; // compute()

  methods.result = function () {
    return (
      {
        // Total items.
        n: items,
        // Their Sum total.
        sum: total,
        // Number of Vital Fews. As the distribution becomes more uniform, the
        // `nVF` approaches `n`.
        nVF: Math.floor( ( total * total ) / ss )
      }
    );
  }; // result()

  return methods;
}; // vitalFew()

// #### Count Cats

// Counts the number of `cat` (i.e. categories) passed to `count()`. It can
// optionally build a frequency table via `buildFT()` along with vital few
// computations.
stats.streaming.countCats = function ( ) {
  var methods = Object.create( null );
  var obj = Object.create( null );
  // Table created via `buildFT()`.
  var table = null;
  // number of unique cats!
  var items;
  // n - vital few.
  var nVF;
  // Sum of all counts.
  var sum;
  // Sum of *n - vital few* counts.
  var sumVF;

  methods.count = function ( cat ) {
    obj[ cat ] = 1 + ( obj[ cat ] || 0 );
    table = null;
  }; // compute()

  methods.buildFT = function () {
    var vf = stats.streaming.vitalFew();
    var vfr;
    table = objHelpers.table( obj, vf.compute );
    table.sort( arrHelpers.descendingOnValue );
    vfr = vf.result();
    items = vfr.n;
    nVF = vfr.nVF;
    sum = vfr.sum;
    sumVF = 0;
    for ( var i = 0, imax = table.length; i < imax; i += 1 ) {
      if ( i < nVF ) sumVF += table[ i ][ 1 ];
      table[ i ].push( table[ i ][ 1 ] * 100 / sum );
    }
  }; // buildFT()

  methods.result = function () {
    if ( table ) {
      return (
        {
          // The object having category/count key/value pairs.
          counts: obj,
          // Unique Categories.
          n: items,
          // Number of Vital Fews.
          nVF: nVF,
          // Their percentage.
          nVFPercent: ( nVF * 100 / items ),
          // Table of Category, Count, %age.
          table: table,
          // Sum of all Category Counts.
          sum: sum,
          // Sum of Vital Few Category Counts.
          sumVF: sumVF,
          // Their percentage.
          sumVFPercent: ( sumVF * 100 / sum )
        }
      );
    }
    return { counts: obj };
  }; // result()

  // To maintain compatibility with earlier functions.
  methods.compute = methods.count;
  return methods;
}; // countCats()

// ### Stats.Robust name space

// Name space for all robust stats like median etc.
stats.robust = Object.create( null );

// #### Percentile

// Returns the `q`th percentile from the `sortedData`. The computation method is
// similar to MINITAB/SAS IV method. Note: MINITAB/SAS are registered trademarks
// of their respective owners and *decisively* or GRAYPE has no direct or indirect
// association with them.
//
// The value `q` must be between 0 and 1 and data (`sortedData`) must be
// presented in a sorted - ascending manner.
stats.robust.percentile = function ( sortedData, q, accessor ) {
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
stats.robust.fiveNumSummary = function ( sortedData, accessor ) {
  var q1 = stats.robust.percentile( sortedData, 0.25, accessor );
  var q2 = stats.robust.percentile( sortedData, 0.50, accessor );
  var q3 = stats.robust.percentile( sortedData, 0.75, accessor );
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

// Computes **mad** and **mean** from the `sortedData` and the `fns` (robust stats,
// obtained from fiveNumSummary). If `fns` is `undefined/null` then it automatically
// computes the five number summary.
// It returns the (updated) `rs` with mad and mean values.
stats.robust.mad = function ( sortedData, fns, accessor ) {
  var rs = fns || stats.robust.fiveNumSummary( sortedData, accessor );
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
  rs.mad = stats.robust.percentile( adfm, 0.50 );
  rs.mean = mean;
  // Now `rs` has **mean** and **mad** both.
  return ( rs );
}; // mad()

// #### Box Plot

// Performs complete box plot analysis using the five number summary (`fns`)
// computed via `fiveNumSummary`. If the `fns` is `undefined/null` then it
// automatically computes the five number summary. It can even accept robust
// stats returned by `mad()`.
// The `coef` is used for outliers computation and defaults to
// **1.5**. It adds the left and right outliers and also the notches for median
// (`q2`). Each outlier, if present, contains the count, fence and begin/end indexes
// to array for easy extraction of exact values.
stats.robust.boxPlot = function ( sortedData, coeff, fns, accessor ) {
  var rs = fns || stats.robust.fiveNumSummary( sortedData, accessor );
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

// ### Stats.Histogram name space

// Name space for different histogram generators.
stats.histogram = Object.create( null );

// #### Sturges

// Generates histogram using Sturges rule with minimum bin count as 5.
// If the `fns` is `undefined/null` then it
// automatically computes the five number summary. It can even accept robust
// stats returned by `mad()`.
// > REVIEW: code repitition in histogram.
stats.histogram.sturges = function ( sortedData, dataPrecision, fns, accessor ) {
  var rs = fns || stats.robust.fiveNumSummary( sortedData );
  var precision = Math.round( Math.abs( dataPrecision || 0 ) );
  var bins = Math.max( Math.ceil( Math.log2( rs.size ) + 1 ), 5 );
  var binWidth = rs.range /  bins;
  binWidth = +binWidth.toFixed( precision );
  if ( binWidth === 0 ) binWidth = 1;
  bins = Math.ceil( rs.range / binWidth );
  rs.histogram = distribution( bins, binWidth, sortedData, rs, precision, accessor );
  return rs;
}; // sturges()

// #### Hybrid

// Generates histogram using Freedman–Diaconis method. The `rsWithMAD` should
// contain robust stats returned via `mad()` or `fiveNumSummary()`; if it is
// `undefined/null`, then it is automatically computed from the `sortedData`.
// If IQR & MAD both are `0` then it automatically
// downgrades to Sturges' Rule while ensuring minimum 5 bins are maintained.
// The `dataPrecision` is of the `sortedData`, i.e. the minumum number of decimal
// places observed in the data. It attempts to reduce the sparsity of distribution,
// if any, by recomputing the number of bins using Sturges' Rule.
stats.histogram.hybrid = function ( sortedData, dataPrecision, rsWithMAD, accessor ) {
  var rs = rsWithMAD || stats.robust.mad( sortedData );
  // Number of bins.
  var bins;
  // Class interval or bin width.
  var binWidth = rs.iqr;
  // The `precision` is extremely important to get a quality histogram - in terms
  // of number of classes and counting data points in a class interval.
  var precision = Math.round( Math.abs( dataPrecision || 0 ) );
  // Compute `bins` and `binWidth`.
  if ( ( binWidth === 0 ) ) {
    if ( rs.mad !== undefined ) stats.robust.mad( sortedData, rs, accessor );
    binWidth = 2 * rs.mad;
  }

  if ( binWidth > 0 ) {
    // Apply Freedman–Diaconis formula.
    binWidth = 2 * binWidth * Math.pow( rs.size, -( 1 / 3 ) );
    // Adjust `binWidth` according to the `precision`.
    binWidth = +binWidth.toFixed( precision );
    if ( binWidth === 0 ) binWidth = 1;
    bins = Math.ceil( rs.range / binWidth );
    rs.histogram = distribution( bins, binWidth, sortedData, rs, precision, accessor );
    // Check how sparse is the distribution - # of 0s > 20% of the total frequencies.
    // If yes then attempt its reduction by using the Sturges' Rule (as above).
    //
    // eslint-disable-next-line
    if ( rs.histogram.freq.filter( function ( e ) { return ( e === 0 ); } ).length > rs.histogram.freq.length * 0.20 ) {
      // Sparse! Apply Sturge's Rule now.
      bins = Math.max( Math.ceil( Math.log2( rs.size ) + 1 ), 5 );
      binWidth = rs.range /  bins;
      binWidth = +binWidth.toFixed( precision );
      if ( binWidth === 0 ) binWidth = 1;
      bins = Math.ceil( rs.range / binWidth );
      rs.histogram = distribution( bins, binWidth, sortedData, rs, precision, accessor );
    }
  } else {
    // Nothing is working out, downgrade to Sturges' Rule, but ensure minimum 5 bins.
    bins = Math.max( Math.ceil( Math.log2( rs.size ) + 1 ), 5 );
    binWidth = rs.range /  bins;
    // Adjust `binWidth` according to `precision` and recompute everything.
    binWidth = +binWidth.toFixed( precision );
    if ( binWidth === 0 ) binWidth = 1;
    bins = Math.ceil( rs.range / binWidth );
    rs.histogram = distribution( bins, binWidth, sortedData, rs, precision, accessor );
  }

  return ( rs );
}; // smart()

module.exports = stats;
