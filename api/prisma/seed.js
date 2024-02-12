const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');
const { hashPassword } = require('../src/utils/auth');

const prisma = new PrismaClient();

async function seed() {
	const username = 'testuser';
	const password = await hashPassword('password');
	const image_url = faker.image.avatar();

	// Create a user
	const user = await prisma.user.create({
		data: {
			username,
			password,
			image_url,
		},
	});

	// Create an admin user
	const admin_user = await prisma.user.create({
		data: {
			username: 'adminuser',
			password: await hashPassword('adminpassword'),
			image_url: faker.image.avatar(),
		},
	});

	await Promise.all(
		Array.from({ length: 10 }).map(async (_, i) => {
			await prisma.tweet.create({
				data: {
					body: faker.commerce.productDescription(),
					user_id: user.id,
				},
			});

			await prisma.tweet.create({
				data: {
					body: faker.commerce.productDescription(),
					user_id: user.id,
				},
			});

			await prisma.follows.create({
				data: {
					following_id: user.id,
					follower_id: admin_user.id,
				},
			});
		})
	);

	console.log(`Database has been seeded. 🌱`);
}

seed()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
