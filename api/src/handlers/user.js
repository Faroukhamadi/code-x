const prisma = require('../db');
const { hashPassword, createJWT, comparePassword } = require('../utils/auth');

const signUp = async (req, res) => {
	try {
		// Check if the username already exists
		const existingUser = await prisma.user.findUnique({
			where: {
				username: req.body.username,
			},
		});

		if (existingUser) {
			// If the username already exists, return an error response
			return res.status(409).json({ error: 'Username already exists' });
		}

		// If the username is not found, create a new user
		const user = await prisma.user.create({
			data: {
				username: req.body.username,
				password: await hashPassword(req.body.password),
			},
		});

		// Generate JWT for the new user
		const token = createJWT(user);

		// Send the token in the response
		res.json({ token });
	} catch (error) {
		// Handle any unexpected errors
		res.status(500).json({ error: 'Internal server error' });
	}
};

const signIn = async (req, res) => {
	const user = await prisma.user.findUnique({
		where: {
			username: req.body.username,
		},
	});

	console.log('user inside signIn', user);

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
