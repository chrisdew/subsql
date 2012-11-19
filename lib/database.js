// This class represents a Database

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
  console.log(tableSpec);
  if (this.tablesByName === tableSpec.name) return "Error: table alreay exists.";
  
  this.tablesByName[tableSpec.name] = new table.Table(tableSpec);
  //console.log(this);
  this.emit('createTable', tableSpec);
  return this;
}

// command is a Javascript object, the result of parsing a line
Database.prototype.exec = function(command) {
  //console.log(command);
  for (var p in command) { // there will only be one
    if (p === 'createTable') this.createTable(command[p]);
  }
}