require('dotenv').config();

const app = require('./server');

const PORT = process.env.PORT || 42069;

app.listen(PORT, () => {
	console.log('listening to server at', PORT);
});
