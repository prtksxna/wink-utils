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
var prepare = require( './prepare_text' );
var similarity = require( './compute_similarity' );
var ah = require( './array_helpers' );
var oh = require( './object_helpers' );

// Because we want to logically group the variables.
/* eslint sort-vars: 0 */

// ### Internal Functions

// #### Exec Prep Tasks

// Executes the `tasks` on the `input` and returns the transformed `input`.
var execPrepTasks = function ( input, tasks ) {
  var data = input;
  // Helper variables: **f**unction, and **t**ask.
  var f, t;
  for ( var i = 0, imax = tasks.length; i < imax; i += 1 ) {
    t = tasks[ i ];
    f = t[ 0 ];
    if ( f.length === 1 ) {
      data = f( data );
    } else {
      data = f( data, t[ 2 ] );
    }
  }
  return data;
}; // execPrepTasks()

// #### Validate Stop Words

// It (a) checks if `sw` is an array of non-empty strings, (b) applies the
// transformations, if defined in prep tasks and (c) uses `prepare.helper.words()`
// to create stopwords R returns.
var validateStopWords = function ( sw, prepTasks ) {
  if ( !sw ) return null;
  if ( !ah.isArray( sw ) ) {
    throw Error( 'textFRC: Stop Words should be an array, instead found: ' + JSON.stringify( sw ) );
  }
  var preparedWords = [];
  var i,
      imax = sw.length;
  if ( !imax ) return null;
  for ( i = 0; i < imax; i += 1 ) {
    if ( ( typeof sw[ i ] !== 'string' ) || ( sw[ i ] === '' ) ) {
      throw Error( 'textFRC: stop word should be non-empty string, instead found: ' + JSON.stringify( sw[ i ] ) );
    }
    // All good, prepare this word.
    preparedWords.push( execPrepTasks( sw[ i ], prepTasks ) );
  }
  // There is no need to supply `mappers` for `words()`, as execPrepTasks has
  // already done the job.
  return prepare.helper.words( preparedWords );
}; // validateStopWords()

// #### Validate Task

// Validates a `task` w.r.t. the `repo`. Throws appropriate error if any
// validation fails. The `task` is an array of function name and
// argument(s) if any - both function name and arguments are validated.
// Returns an array `[ function, name, optional arguments ]`. The `taskType`
// is inlcuded in thrown errors to pin point the location.
var validateTask = function ( taskType, task, repo ) {
  // Task must be an array.
  if ( !ah.isArray( task ) ) {
    throw Error( 'textFRC: ' + taskType +
      ' should be an array, instead found: ' + JSON.stringify( task ) );
  }
  // The first element should be of type string i.e. function name.
  if ( typeof task[ 0 ] !== 'string' ) {
    throw Error( 'textFRC: ' + taskType +
      ' function name should be a string, instead found: ' + JSON.stringify( task[ 0 ] ) );
  }
  // Name of the function
  var name = task[ 0 ].trim();
  // Function's arguments, if any.
  var fargs = task.slice( 1 );
  // Validate arguments.
  for ( var i = 0; i < fargs.length; i += 1 ) {
    if ( ( typeof fargs[ i ] !== 'number' ) &&
         ( typeof fargs[ i ] !== 'boolean' )
       ) {
         throw Error( 'textFRC: ' + taskType +
          ' argument should be an number/boolean, instead found: ' + JSON.stringify( fargs[ i ] ) );
    }
  }
  // Splitting on `.` creates an array where element 0 should be **n**ame **s**pace
  // and element 1 should be the **f**unction.
  var nsf = name.split( '.' );
  var f = repo[ nsf[ 0 ] ];
  f = ( f ) ? f[ nsf[ 1 ] ] : false;

  if ( !f ) throw Error( 'textFRC: ' + taskType +
    ' function is invalid: ' + JSON.stringify( name ) );
  // `tokens.removeWords` arguments are not required as `execPrepTasks` is dropping
  // the job.
  if ( ( name === 'tokens.removeWords' ) && ( fargs.length ) ) {
    throw Error( 'textFRC: tokens.removeWords in ' + taskType +
      ' should not have any arguments; but found: ' + JSON.stringify( fargs.join( ', ' ) ) );
  }
  // Add name at second place.
  fargs.unshift( name );
  // Add function in the beginning.
  fargs.unshift( f );
  // Note `string.createDLFunction()` returns a function that should be used for
  // DL similarity computations:
  if ( fargs[ 1 ] === 'string.createDLFunction' ) fargs[ 0 ] = fargs[ 0 ]( fargs[ 2 ] );
  return fargs;
}; // vailidateTask()

// #### Validate Tasks

// Checks that every element of `tasks` is a valid function and in the correct
// sequence. Correct sequence means calls to function in `string` names space
// can not occur after a `tokens` name space function has been called. Throws
// appropriate error if any validation fails. The `taskType`
// is inlcuded in thrown errors to pin point the location.
var validateTasks = function ( taskType, tasks, repo, stopWords ) {
  var f;
  var i, imax;
  var functions;
  if ( !tasks ) return [];
  if ( !ah.isArray( tasks ) ) {
    throw Error( 'textFRC: ' + taskType +
      ' should be an array of array, instead found: ' + JSON.stringify( tasks ) );
  }
  imax = tasks.length;
  functions = new Array( imax );
  for ( i = 0; i < imax; i += 1 ) {
    // Tasks are always checked in `prepare` repo.
    f = validateTask( 'A task inside ' + taskType, tasks[ i ], repo );
    // > REVIEW: Next Statement has been commented out as it became redundant; Has it?
    // if ( !f ) return false;
    // Can not call a helper function!
    if ( ( imax ) && ( tasks[ 0 ][ 0 ][ 0 ] === 'h' ) ) {
      throw Error( 'textFRC: Invalid function usage in ' + taskType +
        ' Prep Tasks: ' + JSON.stringify( tasks ) );
    }
    // Quick & dirty way to check that `tokens` name space follows `string`
    // name space. Checking with ( i - 1 ) will ensure that both the tasks
    // in the folllowing `if` have been validated.
    if ( i && ( tasks[ i - 1 ][ 0 ][ 0 ] > tasks[ i ][ 0 ][ 0 ] ) ) {
      throw Error( 'textFRC: ' + taskType +
        ' expected a tokens function, instead found: ' +
        JSON.stringify( tasks[ i  ][ 0 ] ) );
    }
    // All good, fill `functions`.
    // But before that handle removeWords case:
    if ( f[ 1 ] === 'tokens.removeWords' ) f.push( stopWords );
    functions[ i ] = f;
  }
  return functions;
}; // validateTasks()

// #### Build Synonyms DB

// Returns a database of `synonyms` defined in the rules. The database has 2
// elements viz a table and an optional index. The table is created by denormalizing
// the rules synonyms: each row is an array - `[ category, synonym ]`. The index
// is created if `indexUsing` key is defined in the rules.
var buildSynonymsDB = function ( synonyms, prepTasks, indexUsing, indexPrepTasks ) {
  if ( !ah.isArray( synonyms ) ) {
    throw Error( 'textFRC: Synonyms should be an array, instead found: ' + JSON.stringify( synonyms ) );
  }
  // For-loop helpers.
  var i,
      imax = synonyms.length;
  var j, jmax;
  // Used for indexing, if required.
  var k = 0;
  // A synonym from synonyms!
  var synonym;
  // Identifier and transformed identifier via prepTasks.
  var id, xid;
  var indexer = ( indexUsing ) ? prepare.helper.index() : false;
  // To detect duplicate categories in synonyms.
  var catSet = new Set();
  // The DB's table.
  var table = [];
  // Indexing function.
  var indexFn;
  for ( i = 0; i < imax; i += 1 ) {
    synonym = synonyms[ i ];
    if ( !oh.isObject( synonym ) ) {
      throw Error( 'textFRC: Synonym should be an object, instead found: ' + JSON.stringify( synonym ) );
    }
    if ( ( typeof synonym.category !== 'string' ) || ( synonym.category === '' ) || ( catSet.has( synonym.category ) ) ) {
      throw Error( 'textFRC: Invalid/duplicate category found: ' + JSON.stringify( synonym.category ) );
    }
    catSet.add( synonym.category );
    if ( !ah.isArray( synonym.identifiers ) || !synonym.identifiers.length ) {
      throw Error( 'textFRC: identifier should be an array of strings, instead found: ' + JSON.stringify( synonym.identifiers ) );
    }
    for ( j = 0, jmax = synonym.identifiers.length; j < jmax; j += 1 ) {
      id = synonym.identifiers[ j ];
      if ( ( typeof id !== 'string' ) || ( id === '' ) ) {
        throw Error( 'textFRC: Identifier should be a non-empty string, instead found: ' + JSON.stringify( id ) );
      }
      // All good, transform each identifier using prepTasks.
      xid = execPrepTasks( id, prepTasks );
      // Build it's index, if required.
      if ( indexer ) {
        indexFn = indexUsing[ 0 ];
        if ( indexFn.length === 3 ) {
          indexFn( execPrepTasks( id, indexPrepTasks ), indexer.build, k );
        } else {
          indexFn( execPrepTasks( id, indexPrepTasks ), indexUsing[ 2 ], indexer.build, k );
        }
        k += 1;
      }
      // Add a row in the table.
      table.push( [
        synonym.category,
        xid
      ] );
    }
  }
  return { table: table, index: ( indexer ) ? indexer.result() : null };
}; // buildSynonymsDB()

// #### Measure Similarity

// Measures similarity between `input1` and `input2` using `similarityMeasure`.
var measureSimilarity = function ( similarityMeasure, input1, input2 ) {
  // The similarity measurement function.
  var f = similarityMeasure[ 0 ];
  // Its additional arguments, if required.
  var a1, a2;
  if ( f.length === 2 ) {
    return f( input1, input2 ).similarity;
    // eslint-disable-next-line no-else-return
  } else {
    a1 = similarityMeasure[ 2 ];
    a2 = similarityMeasure[ 3 ];
    return f( input1, input2, a1, a2 ).similarity;
  }
}; // measureSimilarity()

// ### Text Fuzzy Rule-based Clasifier

// Learns from the `rules` and returns an object having a `predict()` function.
// Throws appropraie errors if any inconsistency is found in the `rules`. The
// `rules` must be a JS Object in the folllowing format:
// ```
// similarityPrepTasks: [
//   [ 'string.lowerCase' ],
//   [ 'string.removeExtraSpaces' ],
//   [ 'string.retainAlphaNums' ],
//   [ 'string.tokenize0' ],
//   [ 'tokens.phonetize' ],
//   [ 'tokens.removeWords' ],
//   [ 'tokens.sow' ]
// ],
// similarityMeasure: [ 'set.jaccard' ],
// stopWords: null,
// stopWordsPrepTasks: [
//   [ 'string.stem' ]
// ],
// indexPrepTasks: [
//   [ 'string.lowerCase' ],
//   [ 'string.removeExtraSpaces' ],
//   [ 'string.retainAlphaNums' ],
//   [ 'string.tokenize0' ],
//   [ 'tokens.phonetize' ],
//   [ 'tokens.removeWords' ]
// ],
// indexUsing: [ 'tokens.bow' ],
// synonyms: [
//   {
//    category: 'cat1',
//    identifiers: [
//      'array of synonyms',
//      'each one should be a string'
//    ]
//   },
//   {
//    category: 'cat2',
//    identifiers: [
//      'another array of synonyms',
//      'each one being a string'
//    ]
//   }
// ]
// };
// ```
var textFRC = function ( rules ) {
  if ( !oh.isObject( rules ) ) {
    throw Error( 'textFRC: rules should be an object, instead found: ' + JSON.stringify( rules ) );
  }
  // Detects stop words task type error.
  var rgxSWPTError = /^(string\.tokenize|tokens)/;
  var stopWordsPrepTasks = validateTasks( 'stopWordsPrepTasks', rules.stopWordsPrepTasks, prepare );
  var name = ( stopWordsPrepTasks.length ) ? stopWordsPrepTasks[ stopWordsPrepTasks.length - 1 ][ 1 ] : '';
  if ( rgxSWPTError.test( name ) ) {
   throw Error( 'textFRC: stop words Prep Tasks should return a string and not tokens: ' + JSON.stringify( name ) );
  }
  var stopWords = validateStopWords( rules.stopWords, stopWordsPrepTasks );
  var indexPrepTasks = validateTasks( 'indexPrepTasks', rules.indexPrepTasks, prepare, stopWords );
  var similarityPrepTasks = validateTasks( 'similarityPrepTasks', rules.similarityPrepTasks, prepare, stopWords );
  var indexUsing = ( rules.indexUsing ) ? validateTask( 'indexUsing', rules.indexUsing, prepare ) : false;
  var sdb = buildSynonymsDB( rules.synonyms, similarityPrepTasks, indexUsing, indexPrepTasks );
  var similarityMeasure = validateTask( 'similarityMeasure', rules.similarityMeasure, similarity );

  // #### Predict

  // Returns the best match along with the similarity as `[ [ match, similarity ] ]`.
  // It automatically uses indexed search, if indexUsing is properly defined;
  // otherwise it uses linear search.
  var predict = function ( input ) {
    if ( !input ) return undefined;
    // The `sdb` table.
    var table = sdb.table;
    // The `sdb` index.
    var index = sdb.index;
    // Current and previous similaritis and the match.
    var smlrty = 0,
        prevSmlrty = 0,
        match;
    // Transformed input.
    var xinput = execPrepTasks( input, similarityPrepTasks );
    // For indexed search.
    var indexKeys, indexKey, ikeys, searched;
    var i, imax;
    // Time to predict!
    if ( indexUsing ) {
      // Use index to search.
      searched = Object.create( null );
      // Handle `soc()` as it only creates an index of first char of string.
      // Note: **No** `sow()` support.
      if ( indexUsing[ 1 ] === 'string.soc' ) {
        indexKeys = {};
        indexKeys[ input[ 0 ] ] = true;
      } else {
        indexKeys = indexUsing[ 0 ]( execPrepTasks( input, indexPrepTasks ) );
      }

      /* eslint max-depth: ["error", 6] */
      // eslint-disable-next-line guard-for-in
      for ( indexKey in indexKeys ) {
        ikeys = index[ indexKey ];
        if ( ikeys ) {
          // Search iff `ikeys` is defined.
          for ( i = 0, imax = ikeys.length; i < imax; i += 1 ) {
            if ( !searched[ ikeys[ i ] ] ) {
              // **Important**: `input` is prototype and `table` is variant.
              smlrty = measureSimilarity( similarityMeasure, xinput, table[ ikeys[ i ] ][ 1 ] );
              searched[ ikeys[ i ] ] = true;
              if ( smlrty > prevSmlrty ) {
                prevSmlrty = smlrty;
                match = table[ ikeys[ i ] ][ 0 ];
              } // if ( smlrty > prevSmlrty )
            } // if ( !searched[ i ] )
          } // for ( i = 0, ...)
        } // if ( !ikeys )
      } // for ( indexKey in ... )
    } else {
      // Perform linear search.
      for ( i = 0, imax = table.length; i < imax; i += 1 ) {
        // **Important**: `input` is prototype and `table` is variant.
        smlrty = measureSimilarity( similarityMeasure, xinput, table[ i ][ 1 ] );
        if ( smlrty > prevSmlrty ) {
          prevSmlrty = smlrty;
          match = table[ i ][ 0 ];
        }
      }
    }
    return [ [ match, prevSmlrty ] ];
  }; // predict()

  var methods = Object.create( null );
  methods.predict = predict;
  return methods;
}; // textFRC();

module.exports = textFRC;
