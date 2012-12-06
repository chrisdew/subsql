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

// This method takes a line and executes it.  Results and/or errors are returned
// as events
Session.prototype.exec = function(line, callback) {
  if (line === '') return '';
  try {
    var command = parser.parse(line);
  } catch (e) {
    //console.log(e);
    return callback([ spaces(e.offset + (this.promptSize ? this.promptSize : 0)) + "^"
                    , 'Syntax error: ' + e.message
                    ].join('\n'));
  }
    this.db.once('createTable', function() {
      console.log('emitting result Table created.');
      return callback(null, 'Table created.');
    });
    var query = this.db.exec(command, function(err, res) {
      console.log("command", command);
      console.log("err", err);
      console.log("res", res);
      if (typeof(callback) === 'function') {
        callback(err, res);
      }
    });
    console.log("6query", query);
    return query;
}

// the unregisters all the resources this session is using
Session.prototype.close = function() {
}