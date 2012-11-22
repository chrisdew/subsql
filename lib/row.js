var util = require('util');
var events = require('events');

exports.hello = hello;
exports.Row = Row;

function hello() {
  return "hello row";
}

function Row(fields, values) {
  this._version = 1;
  for (var i in fields) {
    this[fields[i]] = values[i];
  }
}

util.inherits(Row, events.EventEmitter);

Row.prototype.update = function(pairs) {
  console.log("Pairs",pairs);
  for (var i in pairs) {
    this[pairs[i].field] = pairs[i].expr;
  }
  this._version++; 
}
