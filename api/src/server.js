const express = require('express');
const router = require('./router');
const morgan = require('morgan');
const cors = require('cors');
const { protect } = require('./utils/auth');
const { signUp, signIn } = require('./handlers/user');

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', protect, router);

app.post('/signup', signUp);
app.post('/signin', signIn);

module.exports = app;
