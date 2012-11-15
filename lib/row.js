var util = require('util');
var events = require('events');

exports.hello = hello;
exports.Row = Row;

function hello() {
  return "hello row";
}

function Row() {
  this._version = 1;
}

util.inherits(Row, events.EventEmitter);