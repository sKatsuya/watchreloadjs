// application
var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')
  , opts = require("opts")
  , walk = require('walk')
  , options
  , walker;


// parse options
opts.parse([
  {
    "short": "f",
    "long": "file",
    "description": "response file witch this app returns",
    "value": true,
    "required": true
  },
  {
    "short": "h",
    "long": "host",
    "description": "host FQDN",
    "value": true,
    "require": true
  },
  {
    "short": "b",
    "long": "basePath",
    "description": "base path",
    "value": true,
    "require": false
  },
  {
    "short": "d",
    "long": "dir",
    "description": "watch directory",
    "value": true,
    "require": false
  }
]);

var file = opts.get('file');
var host = opts.get('host');
var basePath = opts.get('basePath');
var dir = opts.get('dir');
if (basePath == undefined) {
  basePath = "./";
}
if (dir == undefined) {
  dir = "./";
}
console.log(">>> file: "+file);
console.log(">>> host: "+host);
console.log(">>> base path: "+basePath);
console.log(">>> watch dir: "+dir);

// port
app.listen(8080);

function handler (req, res) {
  fs.readFile(file,
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    var script = '<script src="/socket.io/socket.io.js"></script>';
    script    += '<script>';
    script    += 'var socket = io.connect("http://'+host+'");';
    script    += 'socket.on("news", function (data) {';
    script    += 'location.reload();';
    script    += '});';
    script    += '</script>';
    script    += '<base href="'+basePath+'">';

    res.writeHead(200);
    res.end(script + data);
  });
}
/*
io.set('transports', [
  "websocket",
  'xhr-polling'
]);
*/
io.sockets.on('connection', function (socket) {
});

// walk ---------------
options = { 
  followLinks: false,
};

walker = walk.walk(dir, options);

walker.on("names", function (root, nodeNamesArray) {
    nodeNamesArray.sort(function (a, b) {
      if (a > b) return 1;
      if (a < b) return -1; 
      return 0;
      }); 
    });

walker.on("directories", function (root, dirStatsArray, next) {
  next();
});

walker.on("file", function (root, fileStats, next) {
  fs.readFile(root+"/"+fileStats.name, function () {
    console.log(root+"/"+fileStats.name);
    fs.watchFile(root+"/"+fileStats.name, function (eventName, filename) {
      console.log("fire reload event");
      io.sockets.emit('news', { hello: 'world' });
    });
    next();
  }); 
});

walker.on("errors", function (root, nodeStatsArray, next) {
  next();
});

walker.on("end", function () {
  console.log(">>> all done");
  console.log(">>> Please access http://" + host + ":8080");
});

