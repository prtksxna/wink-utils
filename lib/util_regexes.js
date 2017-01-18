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
var rgx = Object.create( null );

// Matches standard english punctuations in a text.
rgx.punctuations = /[\’\'\‘\’\`\“\”\"\[\]\(\)\{\}\…\,\.\!\;\?\/\-\:]/ig;
// Matches special characters: `* + % # @ ^ = ~ | \` in a text.
rgx.splChars = /[\*\+\%\#\@\^\=\~\|\\]/ig;
// Matches common english elisions including n't.
// > TODO: treat each one separately to address needs like *is not* <--> *isn't*.
// > TODO: also finalize its replacement strategy.
rgx.elisions = /(?:\'s|\'d|\'m|\'ll|\'ve|\'re|n\'t)\b/g;
// Matches not elision 'nt.
rgx.notElision = /n\'t\b/g;
// Matches space, tab, or new line characters in text.
rgx.spaces = /\s+/ig;
// Matches anything other than space, tab, or new line characters.
rgx.notSpace = /\S/g;
// Matches alpha and space characters in a text.
rgx.alphaSpace = /[a-z\s]/ig;
// Matches alphanumerals and space characters in a text.
rgx.alphaNumericSpace = /[a-z0-9\s]/ig;
// Matches non alpha characters in a text.
rgx.notAlpha = /[^a-z]/ig;
// Matches non alphanumerals in a text.
rgx.notAlphaNumeric = /[^a-z0-9]/ig;
// Matches run of capital words in a text.
rgx.rocWords = /[A-Z]{1,1}[a-z]*([\s][A-Z]{1,1}[a-z]*)*/g;
// Matches integer, decimal, JS floating point numbers in a text.
rgx.number = /[0-9]*\.[0-9]+e[\+\-]{1}[0-9]+|[0-9]*\.[0-9]+|[0-9]+/ig;
// Matches time in 12 hour am/pm format in a text.
rgx.timeIn12HrAMPM = /(?:[0-9]|0[0-9]|1[0-2])((:?:[0-5][0-9])){0,1}\s?(?:[aApP][mM])/ig;
// Matches HTML tags - in fact any thing enclosed in angular brackets including
// the brackets.
rgx.htmlTags = /(?:<[^>]*>)/g;
// Tests if a given string is possibly in the Indian mobile telephone number format.
rgx.mobileIndian = /^(0|\+91)?[789]\d{9}$/;
// Tests if a given string is in the valid email format.
rgx.email = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
// Extracts any number and text from a <number><text> format text.
// Useful in extracting value and UoM from strings like `2.7 Kgs`.
rgx.separateNumAndText = /([0-9]*\.[0-9]+e[\+\-]{1}[0-9]+|[0-9]*\.[0-9]+|[0-9]+)[\s]*(.*)/i;
// Crude date parser for a string containg date in a valid format.
// > TODO: Need to improve this one!
rgx.date = /(\d+)/ig;

//
module.exports = rgx;
