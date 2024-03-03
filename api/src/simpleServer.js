const express = require('express');

const app = express();

app.get('/', (req, res) => {
	console.log('hello from express');
	res.status(200);
	res.json({ message: 'ahlaaa' });
});

app.listen(42069, () => {
	console.log('listening to server on port 42069');
});
