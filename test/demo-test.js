var assert = require("assert")

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
});

