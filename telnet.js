// A telnet server for SubSQL

var telnet = require('telnet')
  , port = Number(process.argv[2]) || 2323
  , readline = require('readline')
  , net = require('net')
  , database = require('./lib/database')
  , sn = require('./lib/session')
  ;
  

var server = telnet.createServer(function (client) {
  var db = new database.Database();

  client.on('window size', function (e) {
    if (e.command === 'sb') {
      // a real "resize" event; 'readline' listens for this
      client.columns = e.columns
      client.rows = e.rows
      client.emit('resize')
    }
  })

  //client.on('suppress go ahead',  console.log)
  //client.on('echo', console.log)
  //client.on('window size', console.log)
  //client.on('x display location', console.log)
  //client.on('terminal speed', console.log)
  //client.on('environment variables', console.log)
  //client.on('transmit binary', console.log)
  //client.on('status', console.log)
  //client.on('linemode', console.log)
  //client.on('authentication', console.log)

  // 'readline' will call `setRawMode` when it is a function
  client.setRawMode = setRawMode

  // make unicode characters work properly
  client.do.transmit_binary()

  // emit 'window size' events
  client.do.window_size()

  session = new sn.Session(db, { promptSize: 8 });

  client.write('\nWelcome to the Proof of Concept SubSQL server, v0.0.2.\n\n');
  var rl = readline.createInterface({
      input: client
    , output: client
    , terminal: true
    //, useGlobal: false
  });
  rl.setPrompt('SubSQL> ');
  rl.prompt();

  rl.on('line', function(line) {
    return session.exec(line, function(err, res) {
      if (err) { client.write(err + '\n'); rl.prompt(); }
      if (res) { client.write(res + '\n'); rl.prompt(); }
    });
  }).on('close', function() {
    session.close();
  });
})

server.on('error', function (err) {
  if (err.code == 'EACCES') {
    console.error('%s: You must be "root" to bind to port %d', err.code, port)
  } else {
    throw err
  }
})

server.on('listening', function () {
  console.log('node repl telnet(1) server listening on port %d', this.address().port)
  console.log('  $ telnet localhost' + (port != 23 ? ' ' + port : ''))
})

server.listen(port)

/**
 * The equivalent of "raw mode" via telnet option commands.
 * Set this function on a telnet `client` instance.
 */

function setRawMode (mode) {
  if (mode) {
    this.do.suppress_go_ahead()
    this.will.suppress_go_ahead()
    this.will.echo()
  } else {
    this.dont.suppress_go_ahead()
    this.wont.suppress_go_ahead()
    this.wont.echo()
  }
}

// now setup an express web app

var express = require('express'),
    fs = require('fs'),
    //conf = process.conf = require('./conf'),
    //uuid = require('node-uuid'),
    app = express();
    
    
// setup express
app.configure(function(){
  app.set('view engine', 'ejs');
  app.set('views'      , __dirname + '/views'         );
  app.set('partials'   , __dirname + '/views/partials');
  //app.set('view engine', 'jade');
  app.use(express.logger());
  app.use(express.methodOverride());
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({ secret: "FIXME: change this to a secret string" }));
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.static(__dirname + '/public'));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  var oneYear = 31557600000;
  app.use(express.static(__dirname + '/public', { maxAge: oneYear }));
  app.use(express.errorHandler());
});

app.get('/', getIndex);
function getIndex(req, res) {
    res.render('index', {} );
}


app.listen(80, "0.0.0.0");