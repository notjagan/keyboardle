'use-strict';

const express = require('express');
const proxy = require('net-browserify');

const argv = require('yargs')
	.scriptName('proxy')
	.option('p', {
		alias: 'port',
		demandOption: true,
		default: 16028,
		describe: 'port to host server on',
		type: 'int'
	})
	.command('[-p port]', 'start the server')
	.argv
;

var app = express();
app.use(proxy());

var server = app.listen(argv.port, function() {
	console.log('Websocket proxy listening on port ' + server.address().port);
});
