// This class represents a Database

var util = require('util');
var events = require('events');

exports.hello = hello;
exports.Table = Table;

function hello() {
  return "hello table";
}


function Table(tableSpec) {
  for (var p in tableSpec) {
    this[p] = tableSpec[p];
  }
  this.rowsByPk = {};
  this.pkName = null;
  this.nextPk = 1;
}

util.inherits(Table, events.EventEmitter);