'use strict';

const fs = require('fs');
const desired_length = 4;

let rawdata = fs.readFileSync('./dictionary/full_dictionary.json');
let full_dictionary = JSON.parse(rawdata);
let shortened_dictionary = {};

let i = 0;
for (const [key, value] of Object.entries(full_dictionary)) {
  if (key.length == desired_length) {
    shortened_dictionary[i + "_" + key] = value;
    i++;
  }
}

let data = JSON.stringify(shortened_dictionary);
fs.writeFileSync('./dictionary/dict_' + desired_length + '.json', data);