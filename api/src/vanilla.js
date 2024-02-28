const http = require('http');

const server = http.createServer(async (req, res) => {
	if (req.url === '/' && req.method === 'GET') {
		res.writeHead(200, { 'Content-Type': 'application/json' });
		res.write(JSON.stringify({ message: 'hello' }));

		res.end();
		return;
	}

	res.writeHead(404, { 'Content-Type': 'application/json' });
	res.end(JSON.stringify({ message: 'nope' }));
});

server.listen(42069, () => {
	console.log('listening to server');
});
