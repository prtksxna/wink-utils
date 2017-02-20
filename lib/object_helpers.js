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
var helpers = {};

var objectKeys = Object.keys;
var objectCreate = Object.create;

// #### is Object

// Tests if argument `v` is a JS object; returns `true` if it is, otherwise returns `false`.
helpers.isObject = function ( v ) {
  return ( ( ( typeof v ) === 'object' ) && ( !!v ) && ( !Array.isArray( v ) ) );
}; // isObject()

// #### keys

// Returns keys of the `obj` in an array.
helpers.keys = function ( obj ) {
  return ( objectKeys( obj ) );
}; // keys()

// #### size

// Returns the number of keys of the `obj`.
helpers.size = function ( obj ) {
  return ( ( objectKeys( obj ) ).length );
}; // size()

// #### values

// Returns all values from each key/value pair of the `obj` in an array.
helpers.values = function ( obj ) {
  var keys = helpers.keys( obj );
  var length = keys.length;
  var values = new Array( length );
  for ( var i = 0; i < length; i += 1 ) {
    values[ i ] = obj[ keys[ i ] ];
  }
  return values;
}; // values()

// #### value Freq

// Returns the frequency of each unique value present in the `obj`, where the
// **key** is the *value* and **value** is the *frequency*.
helpers.valueFreq = function ( obj ) {
  var keys = helpers.keys( obj );
  var length = keys.length;
  var val;
  var vf = objectCreate( null );
  for ( var i = 0; i < length; i += 1 ) {
    val = obj[ keys[ i ] ];
    vf[ val ] = 1 + ( vf[ val ] || 0 );
  }
  return vf;
}; // valueFreq()

// #### table

// Converts the `obj` in to an array of `[ key, value ]` pairs in form of a table.
// Second argument - `f` is optional and it is a function, which is called with
// each `value`.
helpers.table = function ( obj, f ) {
  var keys = helpers.keys( obj );
  var length = keys.length;
  var pairs = new Array( length );
  var ak, av;
  for ( var i = 0; i < length; i += 1 ) {
    ak = keys[ i ];
    av = obj[ ak ];
    if ( typeof f === 'function' ) f( av );
    pairs[ i ] = [ ak, av ];
  }
  return pairs;
}; // table()

module.exports = helpers;
