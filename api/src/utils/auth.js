const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const comparePassword = async (password, hash) => {
	return await bcrypt.compare(password, hash);
};

const hashPassword = async (password) => {
	return await bcrypt.hash(password, 10);
};

const createJWT = (user) => {
	const token = jwt.sign(
		{ id: user.id, username: user.username },
		process.env.JWT_SECRET
	);
	return token;
};

const extractToken = (req) => {
	const bearer = req.headers.authorization;
	if (!bearer) {
		return null;
	}

	const [, token] = bearer.split(' ');
	if (!token) {
		return null;
	}

	return token;
};

const protect = (req, res, next) => {
	const bearer = req.headers.authorization;
	console.log('bearer', bearer);
	if (!bearer) {
		res.status(401);
		res.json({ message: 'Unauthorized' });
		return;
	}

	const [, token] = bearer.split(' ');
	if (!token) {
		console.log('no token');
		res.status(401);
		res.json({ message: 'Unauthorized' });
		return;
	}

	try {
		const user = jwt.verify(token, process.env.JWT_SECRET);
		req.user = user;
		next();
	} catch (error) {
		console.log('error', error);
		res.status(401);
		res.json({ message: 'Unauthorized' });
	}
};

const getUserFromToken = (token) => {
	try {
		const user = jwt.verify(token, process.env.JWT_SECRET);
		return user;
	} catch (error) {
		return null;
	}
};

module.exports = {
	createJWT,
	protect,
	comparePassword,
	hashPassword,
	getUserFromToken,
	extractToken,
};
