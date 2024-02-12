const prisma = require('../db');
const { hashPassword, createJWT } = require('../utils/auth');

const signUp = async (req, res) => {
	// select with the same username
	const existingUser = await prisma.user.findUnique({
		where: {
			username: req.body.username,
		},
	});
	console.log(existingUser);
	const user = await prisma.user.create({
		data: {
			username: req.body.username,
			password: await hashPassword(req.body.password),
		},
	});

	const token = createJWT(user);
	console.log('token', token);
	res.json({ token });
};

const signIn = async (req, res) => {
	const user = await prisma.user.findUnique({
		where: {
			username: req.body.username,
		},
	});

	if (!user) {
		res.status(401);
		res.json({ message: 'Invalid username or password' });
		return;
	}

	const valid = await comparePassword(req.body.password, user.password);
	if (!valid) {
		res.status(401);
		res.json({ message: 'Invalid username or password' });
		return;
	}

	const token = createJWT(user);
	res.json({ token });
};

module.exports = {
	signUp,
	signIn,
};
