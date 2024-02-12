const http = require('http');

const server = http.createServer((req, res) => {
	if (req.method === 'GET' && req.url === '/') {
		res.end();
	}
});

server.listen(42069, () => {
	console.log('server on 42069');
});
