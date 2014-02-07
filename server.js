'use strict';
var st = require('st');
var http = require('http');
var base = 'confcodeofconduct.dev';
var parse = require('url').parse;

var mount = st({
  path: __dirname,
  // url: '/',
  index: 'index.html', // server index.html for directories
  // passthrough: true // pass through if not found, so we can send 404
});

function subdomain(req, res, next) {
  var proto = req.socket.encrypted ? 'https' : 'http';
  var hostparsed = parse(proto + '://' + req.headers.host + req.url);
  var host = hostparsed.hostname;
  var www = /^www\./;

  if (www.test(host)) {
    // hard coded http for now
    var url = proto + '://' + hostparsed.host.replace(www, '') + req.url;
    res.writeHead(302, { location: url });
    return res.end();
  }

  if (host.indexOf(base) === 0 || host.indexOf('localhost:') === 0) {
    next(); // as you were
  } else {
    var matches = (host.match(/^(.*?)\./) || []);
    // subdomain
    if (matches.length === 2) {
      req.url = 'index-' + matches[1] + '.html';
      next();
    } else {
      next();
    }
  }
}

var server = http.createServer(function(req, res) {
  // console.log(req.headers);
  subdomain(req, res, function () {
    mount(req, res, function () {
      console.log('here', req.url);
      res.writeHead(404);
      res.end('404');
    });
  });
}).listen(process.env.PORT || 0, function () {
  console.log('Running on http://localhost:' + server.address().port);
});
