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
  this.tablesByName[tableSpec.name] = new table.Table(tableSpec);
  //console.log(this);
  this.emit('createTable', tableSpec);
  return this;
}


Database.prototype.executeJson = function(json) {
  
}