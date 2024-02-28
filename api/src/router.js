const { Router } = require('express');
const prisma = require('./db');
const jwt = require('jsonwebtoken');
const { getUserFromToken, extractToken } = require('./utils/auth');

const router = Router();

router.get('/users', async (req, res) => {
	try {
		const users = await prisma.user.findMany();
		res.json(users);
	} catch (error) {
		console.error('Error fetching users:', error);
		res.status(500).send('Internal Server Error');
	}
});

router.get('/users/:id', async (req, res) => {
	const userId = req.params.id;

	try {
		const user = await prisma.user.findUnique({
			where: {
				id: userId,
			},
		});

		if (user) {
			res.json(user);
		} else {
			res.status(404).send('User not found');
		}
	} catch (error) {
		console.error(`Error fetching user with ID ${userId}:`, error);
		res.status(500).send('Internal Server Error');
	}
});

router.put('/users/:id', async (req, res) => {
	const userId = req.params.id;
	const updatedUserData = req.body;

	try {
		const updatedUser = await prisma.user.update({
			where: {
				id: userId,
			},
			data: updatedUserData,
		});

		res.json(updatedUser);
	} catch (error) {
		console.error(`Error updating user with ID ${userId}:`, error);
		res.status(500).send('Internal Server Error');
	}
});

router.post('/users', async (req, res) => {
	const newUser = req.body;

	try {
		const createdUser = await prisma.user.create({
			data: newUser,
		});

		res.json(createdUser);
	} catch (error) {
		console.error('Error creating user:', error);
		res.status(500).send('Internal Server Error');
	}
});

router.delete('/users/:id', async (req, res) => {
	const userId = req.params.id;

	try {
		const deletedUser = await prisma.user.delete({
			where: {
				id: userId,
			},
		});

		res.json(deletedUser);
	} catch (error) {
		console.error(`Error deleting user with ID ${userId}:`, error);
		res.status(500).send('Internal Server Error');
	}
});

router.get('/tweets', async (req, res) => {
	const token = extractToken(req);
	const user = getUserFromToken(token);
	try {
		const follower_id = user.id;
		const follows = await prisma.follows.findMany({
			where: { follower_id },
			select: {
				following_id: true,
			},
		});
		const follows_ids = [follower_id, ...follows.map((x) => x.following_id)];

		const tweets = await prisma.tweet.findMany({
			where: { user_id: { in: follows_ids } },
			select: {
				id: true,
				body: true,
				user_id: true,
				user: {
					select: {
						username: true,
						image_url: true,
					},
				},
			},
			orderBy: { updated_at: 'desc' },
		});

		res.json(tweets);
	} catch (error) {
		console.error('Error fetching tweets:', error);
		res.status(500).send('Internal Server Error');
	}
});

router.get('/tweets/:id', async (req, res) => {
	const tweetId = req.params.id;

	try {
		const tweet = await prisma.tweet.findUnique({
			where: {
				id: tweetId,
			},
			include: {
				user: true,
			},
		});

		if (tweet) {
			res.json(tweet);
		} else {
			res.status(404).send('Tweet not found');
		}
	} catch (error) {
		console.error(`Error fetching tweet with ID ${tweetId}:`, error);
		res.status(500).send('Internal Server Error');
	}
});

router.post('/tweets', async (req, res) => {
	const body = req.body.body;
	const token = extractToken(req);
	const user = getUserFromToken(token);

	const tweet = await prisma.tweet.create({
		data: {
			body,
			user: {
				connect: {
					id: user.id,
				},
			},
		},
	});

	res.json(tweet);
});

router.put('/tweets/:id', async (req, res) => {
	const tweetId = req.params.id;
	const updatedTweetData = req.body;

	try {
		const updatedTweet = await prisma.tweet.update({
			where: {
				id: tweetId,
			},
			data: updatedTweetData,
			include: {
				user: true,
			},
		});

		res.json(updatedTweet);
	} catch (error) {
		res.status(500).send('Internal Server Error');
	}
});

router.delete('/tweets/:id', async (req, res) => {
	const token = extractToken(req);
	const user = getUserFromToken(token);
	const tweetId = req.params.id;

	try {
		const deletedTweet = await prisma.tweet.delete({
			where: {
				id: tweetId,
				user_id: user.id,
			},
		});
		res.json(deletedTweet);
	} catch (error) {
		if (error.code === 'P2025') {
			const tweet = await prisma.tweet.findUnique({
				where: {
					id: tweetId,
				},
			});

			if (tweet) {
				res.status(403).send('Forbidden');
			}
		}
		res.status(500).send('Internal Server Error');
	}
});

router.get('/profile/:id', async (req, res) => {
	const userId = req.params.id;
	try {
		const user = await prisma.user.findUnique({
			where: {
				id: userId,
			},
			include: {
				tweets: {
					orderBy: { updated_at: 'desc' },
				},
			},
		});

		if (user) {
			res.json(user);
		} else {
			res.status(404).send('User not found');
		}
	} catch (error) {
		res.status(500).send('Internal Server Error');
	}
});

module.exports = router;
