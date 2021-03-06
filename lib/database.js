// This class represents a Database

var assert = require('assert');
var util = require('util');
var events = require('events');
var table = require('./table');

exports.hello = hello;
exports.Database = Database;

function hello() {
  return "hello database";
}

function Database() {
  this.tablesByName = {};
}

util.inherits(Database, events.EventEmitter);

Database.prototype.createTable = function(tableSpec) {
  //console.log(tableSpec);
  if (this.tablesByName[tableSpec.name]) return "Error: table alreay exists.";
  
  this.tablesByName[tableSpec.name] = new table.Table(tableSpec);
  //console.log(this);
  this.emit('createTable', tableSpec);
  return this;
}

Database.prototype.insert = function(spec, callback) {
  var table = this.tablesByName[spec.table];
  if (!table) return "Error: table does not exist.";
  
  table.insert(spec, callback);
  //console.log(JSON.stringify(this));
  return this;
}

Database.prototype.selectStar = function(spec, callback) {
  // TODO: handle multi table selects
  assert(spec.from.length === 1);
  var table = this.tablesByName[spec.from[0]];
  if (!table) return callback("Error: table '" + spec.from[0] + "' does not exist.");
  table.selectStar(spec, callback);
  //return this;
}

Database.prototype.pushStar = function(spec, callback) {
  // TODO: handle multi table selects
  assert(spec.from.length === 1);
  var table = this.tablesByName[spec.from[0]];
  if (!table) return callback("Error: table '" + spec.from[0] + "' does not exist.");
  return table.pushStar(spec, callback);
}

Database.prototype.update = function(spec, callback) {
  console.log('spec', spec);
  var table = this.tablesByName[spec.table];
  if (!table) return callback("Error: table '" + spec.table + "' does not exist.");
  table.update(spec, callback);
}


// command is a Javascript object, the result of parsing a line
Database.prototype.exec = function(command, callback) {
  //console.log(command);
  for (var p in command) { // there will only be one
    if (p === 'createTable') return this.createTable(command[p], callback);
    if (p === 'insert') return this.insert(command[p], callback);
    if (p === 'selectStar') return this.selectStar(command[p], callback);
    if (p === 'pushStar') return this.pushStar(command[p], callback);
    if (p === 'update') return this.update(command[p], callback);
  }
  return callback("unhandled command: " + JSON.stringify(command));
}