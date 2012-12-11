var assert = require("assert");
var Step = require("step");

var session = require('../lib/session.js');
var database = require('../lib/database.js');


describe('Session', function() {
  var db = new database.Database();
  var sess = new session.Session(db);
  it('should run a complex script', function(done) {
    sess.exec('create table events (id integer primary key auto_increment, name varchar, start integer, duration integer)', function(err, res) {
      assert.equal('Table created.', res);
      sess.exec('insert into events (name, start, duration) values ("dentist", 1000, 100)', function(err, res) {
        assert.equal('1 row inserted.', res);
        sess.exec('insert into events (name, start, duration) values ("doctor", 3000, 100)', function(err, res) {
          assert.equal('1 row inserted.', res);
          sess.exec('insert into events (name, start, duration) values ("accountant", 5000, 100)', function(err, res) {
            assert.equal('1 row inserted.', res);
            sess.exec('select * from events where start >= 1000 and start < 4000', function(err, res) {
              assert.deepEqual([{"_version":1,"name":"dentist","start":1000,"duration":100},{"_version":1,"name":"doctor","start":3000,"duration":100}],res);
              done();
            });
          });
        });
      });
    });   
  });
  var db2 = new database.Database();
  var sess2 = new session.Session(db2);
  it('should run a complex realtime script2', function(done) {
    sess2.exec('create table events (id integer primary key auto_increment, name varchar, start integer, duration integer)', function(err, res) {
      assert.equal('Table created.', res);
      sess2.exec('insert into events (name, start, duration) values ("dentist", 1000, 100)', function(err, res) {
        assert.equal('1 row inserted.', res);
        sess2.exec('insert into events (name, start, duration) values ("doctor", 3000, 100)', function(err, res) {
          assert.equal('1 row inserted.', res);
          sess2.exec('insert into events (name, start, duration) values ("accountant", 5000, 100)', function(err, res) {
            assert.equal('1 row inserted.', res);
            var query = sess2.exec('push * from events where start >= 1000 and start < 4000');
            var initialised = false;
console.log("AAA", query);
            query.once('init', function(data) {
              console.log("init", data);
              assert.deepEqual([ { _version: 1, name: 'dentist', start: 1000, duration: 100 },
                                 { _version: 1, name: 'doctor', start: 3000, duration: 100 } ], data)
              initialised = true;
              sess2.exec('insert into events (name, start, duration) values ("barber", 3000, 100)', function(err, res) {
                assert.equal('1 row inserted.', res);
                console.log("got here");
              });
            });
            query.once('delta', function(delta) {
              console.log("delta", delta);
              assert(initialised);
              assert.deepEqual({"op":"insert","table":"events","row":{"_version":1,"name":"barber","start":3000,"duration":100}, "pos":2}
, delta);
              done();
            });
          });
        });
      });
    });   
  });
  var db3 = new database.Database();
  var sess3 = new session.Session(db3);
  it('should run a complex realtime script3', function(done) {
    sess3.exec('create table events (id integer primary key auto_increment, name varchar, start integer, duration integer)', function(err, res) {
      assert.equal('Table created.', res);
      sess3.exec('insert into events (name, start, duration) values ("dentist", 1000, 100)', function(err, res) {
        assert.equal('1 row inserted.', res);
        sess3.exec('insert into events (name, start, duration) values ("doctor", 3000, 100)', function(err, res) {
          assert.equal('1 row inserted.', res);
          sess3.exec('insert into events (name, start, duration) values ("accountant", 5000, 100)', function(err, res) {
            assert.equal('1 row inserted.', res);
            var query = sess3.exec('push * from events where start >= 1000 and start < 4000');
            var initialised = false;
console.log("AAA", query);
            query.once('init', function(data) {
              console.log("init", data);
              assert.deepEqual([ { _version: 1, name: 'dentist', start: 1000, duration: 100 },
                                 { _version: 1, name: 'doctor', start: 3000, duration: 100 } ], data)
              initialised = true;
              sess3.exec('insert into events (name, start, duration) values ("mechanic", 4000, 100)', function(err, res) {
                assert.equal('1 row inserted.', res);
                sess3.exec('insert into events (name, start, duration) values ("barber", 3000, 100)', function(err, res) {
                  assert.equal('1 row inserted.', res);
                  console.log("got here");
                });
              });
            });
            query.on('delta', function(delta) {
              console.log("delta", delta);
              assert(initialised);
              assert.deepEqual({"op":"insert","table":"events","row":{"_version":1,"name":"barber","start":3000,"duration":100},"pos":2}
, delta);
              done();
            });
          });
        });
      });
    });   
  });
  it('should run a complex realtime script with an update', function(done) {
    var db = new database.Database();
    var sess = new session.Session(db);
    Step(
      function createTable() {
        sess.exec('create table customers (id integer primary key auto_increment, name varchar, age integer)', this);
      },
      function insertCustomer1(err, message) {
        assert(!err, err);
        assert.equal("Table created.", message);
        sess.exec('insert into customers (name, age) values ("james", 41)', this);
      },
      function insertCustomer2(err, message) {
        assert(!err, err);
        assert.equal("1 row inserted.", message);
        sess.exec('insert into customers (name, age) values ("thomas", 19)', this);
      },
      function updateCustomer1(err, message) {
        assert(!err, err);
        assert.equal("1 row inserted.", message);
        sess.exec('update customers set age = 42 where name = "thomas"', this);
      },
      function end(err, message) {
        assert(!err, err);
        assert.equal("1 row updated.", message);
        done();
      }
        
    );
  });
});

