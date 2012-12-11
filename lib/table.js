// This class represents a Database

var util = require('util');
var events = require('events');
var row = require('./row');
var qry = require('./query');
var assert = require('assert');

exports.hello = hello;
exports.Table = Table;

function hello() {
  return "hello table";
}


function Table(spec) {
  console.log("Tabke::Table spec:", spec);
  
  for (var p in spec) {
    this[p] = spec[p];
  }
  this.ai = false;
  this.rowsByPk = {};
  this.pkName = null;
  if (spec && spec.fields) {
    for (var i in spec.fields) {
      if (spec.fields[i].pk) {
        this.pkName = spec.fields[i].field;
        if (spec.fields[i].ai) {
          this.ai = true;
        }
      }
    } 
  }
  this.nextPk = 1;
}

util.inherits(Table, events.EventEmitter);

Table.prototype.insert = function(spec, callback) {
  console.log("Table::insert", spec);
  
  // check for sanity
  if (spec.values.length !== spec.fields.length) {
    return ("There must be the smae number of values as keys.");
  }
  
  // find index of pk
  var idxPk = null;
  for (var i in spec.fields) {
    if (spec.fields[i] === this.pkName) {
      idxPk = i; break;
    }
  }
  
  // get/generate pk
  var pk
  if (idxPk === null) {
    if (this.ai) {
      pk = this.nextPk++;
    } else {
      console.log("Table::insert this.ai:", this.ai);
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
  console.log('Table::insert emitting');
  this.emit('delta', {op:'insert',table:this.name,row:r});
  if (callback) callback(null, "1 row inserted.");
  return this;
}

Table.prototype.update = function(spec, callback) {
  console.log("Table::update", spec);
  var count = 0;
  
  var evaluate = createFn(spec.where.expr);
  
  for (var pk in this.rowsByPk) {
    var r = this.rowsByPk[pk];
    console.log("evaluate", r, evaluate(r));
    if (evaluate(r)) {
      count++;
      r.update(spec.set);
      this.emit('delta', {op:'update',table:this.name,pk:pk,set:spec.set});
    }
  }
  if (callback) callback(null, count + " row updated.");
}

Table.prototype.selectStar = function(spec, callback) {
  console.log("Table::selectStar", spec);
  
  var whereFn = function() { return true; };
  if (spec.where && spec.where.expr) {
    whereFn = createFn(spec.where.expr);
  }
  
  var ret = [];
  for (var p in this.rowsByPk) {
    var row = this.rowsByPk[p];
    if (whereFn(row)) {
      ret.push(row);
    }
  }
  callback(null, ret);
}

Table.prototype.pushStar = function(spec, callback) {
  console.log("Table::pushStar", spec);
  
  var query = new qry.Query(this, spec);
  
  return query;
}




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


