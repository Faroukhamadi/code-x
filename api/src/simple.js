const express = require('express');
const app = express();
const port = 42069;
const path = require('path');

app.use(express.static('static'));

/**
 * app.[method]([route], [route handler])
 */
app.get('/', (req, res) => {
	// sending back an HTML file that a browser can render on the screen.
	res.sendFile(path.resolve('pages/index.html'));
});

app.get('/profile', (req, res) => {
	// sending back an HTML file that a browser can render on
	// the screen
	res.sendFile(path.resolve('pages/profile.html'));
});

// creates and starts a server for our API on a defined port
app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
