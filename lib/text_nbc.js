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
var arrayHelpers = require( 'wink-utils/lib/array_helpers' );
var objectHelpers = require( 'wink-utils/lib/object_helpers' );

// Because we want to logically group the variables.
/* eslint sort-vars: 0 */

// It is a **N**aive **B**ayes **C**lassifier for **text** classification.
// It exposes following methods:
// 1. `definePrepTasks` allows to define a pipeline of functions that will be
// used to prepare each input prior to *learning*, *prediction*, and *evaluation*.
// 2. `learn` from example *input* and *label* pair(s).
// 3. `consolidate` learnings prior to evaluation and/or prediction.
// 4. `predict` the best *label* for the given *input*.
// 5. `stats` of learnings.
// 6. `exportJSON` exports the learnings in JSON format.
// 7. `importJSON` imports the learnings from JSON that may have been saved on disk.
// 8. `evaluate` the learnings from known examples of *input* and corresponding
// *label* by internally building a confusion matrix.
// 9. `metrices` are primarily macro-averages of *precison*, *recall*,
// and *f-measure* computed from the confusion matrix built during the evaluation
// phase.
var textNBC = function () {
  // Total samples encountered under each label during learning.
  var samples = Object.create( null );
  // Maintains label-wise count of each word encountered during learning.
  var count = Object.create( null );
  // Maintains count of words encountered under a label during learning.
  var words = Object.create( null );
  // The entire vocabulary.
  var voc = new Set();
  // Preparatory tasks that are executed on the `learn` & `predict` input.
  var pTasks = [];
  // And its count.
  var pTaskCount;
  // All the labels seen till the point of consolidation.
  var labels;
  // And their count: meant to be used in for-loops.
  var labelCount;
  // The `predict()` function checks for this being true; set in `consolidate()`.
  var consolidated = false;
  // The `metrices()` checks this; set in `evaluate()`.
  var evaluated = false;
  // Confusion Matrix.
  var cm = Object.create( null );
  // Metrices: Precision, Recall, and F-Measure
  var precision = Object.create( null );
  var recall = Object.create( null );
  var fmeasure = Object.create( null );
  // Returned!
  var methods = Object.create( null );

  // ### Private functions

  // #### Prepare Input

  // Prepares the `input` by building a pipeline of tasks defined in the variable
  // `pTasks` via `definePrepTasks()`
  var prepareInput = function ( input ) {
    var processedInput = input;
    for ( var i = 0; i < pTaskCount; i += 1 ) {
      processedInput = pTasks[ i ]( processedInput );
    }
    return ( processedInput );
  }; // prepareInput()

  // #### Log Likelihood

  // Computes the 1+ smoothed log likelihood `( w | label )`.
  var logLikelihood = function ( w, label ) {
    return (
      ( voc.has( w ) ) ?
        Math.log2( ( ( count[ label ][ w ] || 0 ) + 1 ) / ( words[ label ] + voc.size ) ) :
        0
    );
  }; // logLikelihood()

  // #### Inverse Log Likelihood

  // Computes the 1+ smoothed log likelihood `( w | label )`.
  var inverseLogLikelihood = function ( w, label ) {
    // Index and temporary label.
    var i, l;
    // `count[ l ][ w ]`.
    var clw = 0;
    // `words[ l ]`
    var wl = 0;

    for ( i = 0; i < labelCount; i += 1 ) {
      l = labels[ i ];
      if ( l !== label ) {
        wl += words[ l ];
        clw += ( count[ l ][ w ] || 0 );
      }
    }
    return (
      ( voc.has( w ) ) ?
        Math.log2( ( clw + 1 ) / ( wl + voc.size ) ) :
        0
    );
  }; // inverseLogLikelihood()

  // #### Odds

  // Computes the odds for `( tokens | label )`.
  var odds = function ( tokens, label ) {
    // Total number of samples encountered during training.
    var sum = 0;
    // Samples enountered under `label` during training.
    var samplesInLabel = samples[ label ];
    // Samples NOT enountered under the `label`.
    var samplesNotInLabel = 0;
    // Log Base 2 Likelihood & Inverse likelihood
    var lh, ilh;
    // Temp Label.
    var lbl, i, imax;

    // Compute `samplesNotInLabel`.
    for ( i = 0; i < labelCount; i += 1 ) {
      lbl = labels[ i ];
      sum += samples[ lbl ];
      samplesNotInLabel += ( lbl === label ) ? 0 : samples[ lbl ];
    }

    // Initialize likelihoods with prior probabilities.
    lh =  Math.log2( samplesInLabel / sum );
    ilh = Math.log2( samplesNotInLabel / sum  );

    // Update them for the given tokens for `label`
    for ( i = 0, imax = tokens.length; i < imax; i += 1 ) {
      lh += logLikelihood( tokens[ i ], label );
      ilh += inverseLogLikelihood( tokens[ i ], label );
    }

    // Return the log likelihoods ratio; subtract as it is a log. This will
    // be a measure of distance between the probability & inverse probability.
    return ( lh - ilh );
  }; // odds()

  // ### Exposed Functions

  // #### Define Prep Tasks

  // Defines the `tasks` required to prepare the input for `learn()` and `predict()`
  // The `tasks` should be an array of functions; using these function a simple
  // pipeline is built to serially transform the input to the output.
  // It validates the `tasks` before updating the `pTasks`.
  // If validation fails it returns `false`; otherwise it sets the
  // `pTasks` and returns `true`.
  var definePrepTasks = function ( tasks ) {
    if ( !arrayHelpers.isArray( tasks ) ) return false;
    for ( var i = 0, imax = tasks.length; i < imax; i += 1 ) {
      if ( typeof tasks[ i ] !== 'function' ) return false;
    }
    pTasks = tasks;
    pTaskCount = tasks.length;
    return true;
  }; // definePrepTasks()

  // #### Learn

  // Learns from example pair of `input` and `label`. Setting
  // `considerOnlyPresence` to `true` ignores the frequency of each token and
  // instead only considers it's presence. It's default value is `false`.
  // If learning was successful then it returns `true`; otherwise it returns `false`.
  var learn = function ( input, label, considerOnlyPresence ) {
    // No point in learning further, if learnings so far have been consolidated.
    if ( consolidated ) return false;
    // Prepare the input.
    var tkns = prepareInput( input );
    // Update vocubulary, count, and words i.e. learn!
    samples[ label ] = 1 + ( samples[ label ] || 0 );
    if ( considerOnlyPresence ) tkns = new Set( tkns );
    count[ label ] = count[ label ] || Object.create( null );
    tkns.forEach( function ( token ) {
      count[ label ][ token ] = 1 + ( count[ label ][ token ] || 0 );
      voc.add( token );
      words[ label ] = 1 + ( words[ label ] || 0 );
    } );
    return true;
  }; // learn()

  // #### Consolidate

  // Consolidates the learnings in following steps:
  // 1. Check presence of minimal learning mass, if present proceed further;
  // 2. Freeze all relevant JS Objects;
  // 3. Initializes the confusion matrix and metrices.
  var consolidate = function () {
    var row, col;
    var i, j;
    // Extract all labels that have been seen during learning phase.
    labels = objectHelpers.keys( samples );
    labelCount = labels.length;
    // A quick & simple check of some minimal learning mass!
    if ( labelCount < 2 ) return false;
    if ( voc.size < 10 ) return false;
    // Freeze learnings!
    Object.freeze( samples );
    Object.freeze( count );
    Object.freeze( words );
    // Initialize confusion matrix and metrices.
    for ( i = 0; i < labelCount; i += 1 ) {
      row = labels[ i ];
      cm[ row ] = Object.create( null );
      precision[ row ] = 0;
      recall[ row ] = 0;
      fmeasure[ row ] = 0;
      for ( j = 0; j < labelCount; j += 1 ) {
        col = labels[ j ];
        cm[ row ][ col ] = 0;
      }
    }
    // Set `consolidated` as `true`.
    consolidated = true;
    return true;
  }; // consolidate()

  // #### Predict

  // Predicts the potential **label** for the given `input`, provided learnings
  // have been consolidated. If all the `input` tokens have never been seen
  // in past (i.e. absent in learnings), then the predicted label is `undefined`.
  var predict = function ( input ) {
    // Predict only if learnings have been consolidated!
    if ( !consolidated ) return null;
    // Contains label & the corresponding odds pairs.
    var allOdds = [];
    // Temporary label.
    var label;
    for ( var i = 0; i < labelCount; i += 1 ) {
      label = labels[ i ];
      allOdds.push( [ label, odds( prepareInput( input ), label ) ] );
    }
    // Sort descending for argmax.
    allOdds.sort( arrayHelpers.descendingOnValue );
    // If odds for the top label is 0 means prediction is `undefined`
    // otherwise return the corresponding label.
    return ( ( allOdds[ 0 ][ 1 ] ) ? allOdds[ 0 ][ 0 ] : undefined );
  };

  // #### Stats

  // Returns basic stats of learning.
  var stats = function () {
    return (
      {
        // Count of samples under each label.
        labelWiseSamples: JSON.parse( JSON.stringify( samples ) ),
        // Total words (a single word occuring twice is counted as 2)
        // under each label.
        labelWiseWords: JSON.parse( JSON.stringify( words ) ),
        // Size of the vocubulary.
        vocabulary: voc.size
      }
    );
  }; // predict()

  // #### Export JSON

  // Returns the learnings, without any consolidation check, in JSON format.
  var exportJSON = function ( ) {
    var vocArray = [];
    // Vocubulary set needs to be converted to an array.
    voc.forEach( function ( e ) {
      vocArray.push( e );
    } );
    return ( JSON.stringify( [ samples, count, words, vocArray ] ) );
  }; // exportJSON()

  // #### Import JSON

  // Imports the `json` in to learnings after validating the format of input JSON.
  // If validation fails then it returns `false`; otherwise on success import it
  // returns `true`.
  var importJSON = function ( json ) {
    if ( !json ) return false;
    // Validate json format
    var isOK = [
      objectHelpers.isObject,
      objectHelpers.isObject,
      objectHelpers.isObject,
      arrayHelpers.isArray
    ];
    var parsedJSON = JSON.parse( json );
    if ( parsedJSON.length !== isOK.length ) return false;
    for ( var i = 0; i < isOK.length; i += 1 ) {
      if ( !isOK[ i ]( parsedJSON[ i ] ) ) return false;
    }
    // All good, setup variable values.
    samples = parsedJSON[ 0 ];
    count = parsedJSON[ 1 ];
    words = parsedJSON[ 2 ];
    voc = new Set( parsedJSON[ 3 ] );
    // Return success.
    return true;
  }; // importJSON()

  // #### Evaluate

  // Evaluates the prediction using the `input` and its known `label`. It
  // accordingly updates the confusion matrix. If the `label` is unknown or
  // prediction fails (no consolidation or `undefined`), it does not uppdate
  // the confusion matrix and returns `false`; otherwise it updates the matrix
  // and returns `true`.
  var evaluate = function ( input, label ) {
    // In case of unknown label, indicate failure
    if ( !samples[ label ] ) return false;
    var prediction = predict( input );
    // Check if prediction truely happened: it can fail due to completely unseen
    // vocubulary or while trying to predict without consolidating the learnings.
    if ( !prediction ) return false;
    // Update confusion matrix.
    if ( prediction === label ) {
      cm[ label ][ prediction ] += 1;
    } else {
      cm[ prediction ][ label ] += 1;
    }
    evaluated = true;
    return true;
  }; // evaluate()

  // #### Metrices

  // Computes the metrices from the confusion matrix built during the evaluation
  // phase via `evaluate()`. In absence of evaluations, it returns `null`; otherwise
  // it returns an object containing summary metrices along with the details.
  var metrices = function () {
    if ( !evaluated ) return null;
    // Numerators for every label; they are same for precision & recall both.
    var n = Object.create( null );
    // Only denominators differs for precision & recall
    var pd = Object.create( null );
    var rd = Object.create( null );
    // `row` and `col` of confusion matrix.
    var row, col;
    var i, j;
    // Macro average values for metrices.
    var avgPrecision = 0;
    var avgRecall = 0;
    var avgFMeasure = 0;

    // Compute label-wise numerators & denominators!
    for ( i = 0; i < labelCount; i += 1 ) {
      row = labels[ i ];
      for ( j = 0; j < labelCount; j += 1 ) {
        col = labels[ j ];
        if ( row === col ) {
          n[ row ] = cm[ row ][ col ];
        }
        pd[ row ] = cm[ row ][ col ] + ( pd[ row ] || 0 );
        rd[ row ] = cm[ col ][ row ] + ( rd[ row ] || 0 );
      }
    }
    // Ready to compute metrices.
    for ( i = 0; i < labelCount; i += 1 ) {
      row = labels[ i ];
      precision[ row ] = +( n[ row ] / pd[ row ] ).toFixed( 4 );
      recall[ row ] = +( n[ row ] / rd[ row ] ).toFixed( 4 );
      fmeasure[ row ] = +( 2 * precision[ row ] * recall[ row ] / ( precision[ row ] + recall[ row ] ) ).toFixed( 4 );
    }
    // Compute thier averages, note they will be macro avegages.
    for ( i = 0; i < labelCount; i += 1 ) {
      avgPrecision += ( precision[ labels[ i ] ] / labelCount );
      avgRecall += ( recall[ labels[ i ] ] / labelCount );
      avgFMeasure += ( fmeasure[ labels[ i ] ] / labelCount );
    }
    // Return metrices.
    return (
      {
        // Macro-averaged metrices.
        avgPrecision: +avgPrecision.toFixed( 4 ),
        avgRecall: +avgRecall.toFixed( 4 ),
        avgFMeasure: +avgFMeasure.toFixed( 4 ),
        details: {
          // Confusion Matrix.
          confusionMatrix: cm,
          // Label wise metrices details, from those averages were computed.
          precision: precision,
          recall: recall,
          fmeasure: fmeasure
        }
      }
    );
  }; // metrices()

  methods.learn = learn;
  methods.consolidate = consolidate;
  methods.predict = predict;
  methods.stats = stats;
  methods.definePrepTasks = definePrepTasks;
  methods.evaluate = evaluate;
  methods.metrices = metrices;
  methods.exportJSON = exportJSON;
  methods.importJSON = importJSON;

  return ( methods );
};

// Export textNBC.
module.exports = textNBC;
