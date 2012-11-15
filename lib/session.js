// This class represents a Session

var util = require('util');
var events = require('events');
var peg = require('pegjs');
var fs = require('fs');
var parser = peg.buildParser(fs.readFileSync('lib/grammar.pegjs', 'utf8'));

exports.hello = hello;
exports.Session = Session;

function hello() {
  return "hello session";
}

function Session(db, options) {
  for (var p in options) {
    this[p] = options[p];
  }
  this.db = db;
}

util.inherits(Session, events.EventEmitter);

// returns a string of num spaces
function spaces(num) {
  var ret = [];
  for (var i = 0; i < num; i++) {
    ret.push(' ');
  }
  return ret.join('');
}

// This method takes a line, executes it and retunrs the error or the result.
Session.prototype.exec = function(line) {
  if (line === '') return '';
  try {
    var command = parser.parse(line);
  } catch (e) {
    //console.log(e);
    return [ spaces(e.offset + (this.promptSize ? this.promptSize : 0)) + "^"
           , 'Syntax error: ' + e.message
           ].join('\n');
  }
  return 'OK';
}

// the unregisters all the resources this session is using
Session.prototype.close = function() {
}