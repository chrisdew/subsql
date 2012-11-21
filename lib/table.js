// This class represents a Database

var util = require('util');
var events = require('events');
var row = require('./row');

exports.hello = hello;
exports.Table = Table;

function hello() {
  return "hello table";
}


function Table(spec) {
  for (var p in spec) {
    this[p] = spec[p];
  }
  this.rowsByPk = {};
  this.pkName = null;
  if (spec && spec.fields) {
    for (var i in spec.fields) {
      if (spec.fields[i].pk) {
        this.pkName = spec.fields[i].field;
      }
    } 
  }
  this.nextPk = 1;
}

util.inherits(Table, events.EventEmitter);

Table.prototype.insert = function(spec, callback) {
  // check for sanity
  if (spec.values.length !== spec.fields.length) {
    return ("There must be the smae number of values as keys.");
  }
  
  // find index of pk
  var idxPk = null;
  for (var i in spec.fields) {
    if (spec.fields[i] === this.pkName) { idxPk = i; break; }
  }
  
  // get/generate pk
  var pk
  if (idxPk === null) {
    if (this.ai) {
      pk = this.nextPk++;
    } else {
      callback("No primary key found.");
    }
  } else {
    pk = spec.values[idxPk];
    if (this.fields[idxPk].ai) {
      this.nextPk = pk + 1; 
    }
  }
  
  // check for dups
  if (this.rowsByPk[pk]) {
    callback("Duplicate Primary Key");
  }
  
  var r = new row.Row(spec.fields, spec.values);
  this.rowsByPk[pk] = r;
  if (callback) callback(null, "1 row inserted.");
  this.emit('delta', {op:'insert',row:r});
  return this;
}
