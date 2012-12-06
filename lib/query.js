// This class represents a Database

var util = require('util');
var events = require('events');
var row = require('./row');
var assert = require('assert');

exports.hello = hello;
exports.Query = Query;

function hello() {
  return "hello query";
}


function Query(table, spec) {
  console.log("Query::Query spec:", spec);
  var that = this;
  
  // subscribe to table changes
  this.table = table;
  
  table.on('delta', function(delta) {
    console.log('received delta from table', delta);
    that.emit('delta', delta);
  });
  
  var whereFn = function() { return true; };
  if (spec.where && spec.where.expr) {
    whereFn = createFn(spec.where.expr);
  }
  
  var ret = [];
  for (var p in table.rowsByPk) {
    var row = table.rowsByPk[p];
    if (whereFn(row)) {
      ret.push(row);
    }
  }
  
  // we make a separate init event, rather than making them all deltas, as
  // there needs to be a clear divide beween the
  // a) accumulated change over all history before the query (i.e. initial state) and the
  // b) realtime deltas after the query
  process.nextTick(function() {
    console.log('init', ret);
    that.emit('init', ret);
  });
}

util.inherits(Query, events.EventEmitter);


function createFn(expr) {
  console.log("createFn", expr);
  if (typeof(expr) === "string") {
    return function() {
      return expr;
    }
  }
  if (typeof(expr) === "number") {
    return function() {
      return expr;
    }
  }
  if (expr.field) {
    return function(r) {
      return r[expr.field];
    }
  }
  
  assert(expr.fn);
  var arity = expr.args.length;
  var fns = [];
  for (var i = 0; i < arity; i++) {
    fns.push(createFn(expr.args[i]));
  }
  
  if (arity === 0) {
  } else if (arity === 1) {
    if (expr.fn === 'equalsOne') {
      return function(r) {
        return fns[0](r) === 1;
      }
    }
  } else if (arity === 2) {
    if (expr.fn === 'equal') {
      return function(r) {
        return fns[0](r) === fns[1](r); 
      }
    }
    if (expr.fn === 'and') {
      return function(r) {
        return fns[0](r) && fns[1](r); 
      }
    }
    if (expr.fn === 'gt') {
      return function(r) {
        return fns[0](r) > fns[1](r); 
      }
    }
    if (expr.fn === 'gte') {
      return function(r) {
        return fns[0](r) >= fns[1](r); 
      }
    }
    if (expr.fn === 'lt') {
      return function(r) {
        return fns[0](r) < fns[1](r); 
      }
    }
    if (expr.fn === 'lte') {
      return function(r) {
        return fns[0](r) <= fns[1](r); 
      }
    }
  } else {
    throw "cannot handle arity of " + arity + " in " + JSON.stringify(expr);
  }
  throw "cannot handle " + JSON.stringify(expr);
}


