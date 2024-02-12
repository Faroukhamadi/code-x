import { auth } from '$lib/server/lucia';
import { fail, redirect } from '@sveltejs/kit';
import { Prisma } from '@prisma/client';

import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (session) throw redirect(302, '/tweets');
	return {};
};

export const actions: Actions = {
	default: async ({ request, locals, cookies }) => {
		const form_data = await request.formData();
		const username = form_data.get('username');
		const password = form_data.get('password');
		// basic check
		if (typeof username !== 'string' || username.length < 4 || username.length > 31) {
			return fail(400, {
				message: 'Invalid username'
			});
		}
		if (typeof password !== 'string' || password.length < 6 || password.length > 255) {
			return fail(400, {
				message: 'Invalid password'
			});
		}
		// call localhost:42069/signup rest endpoint to create a new user and get a session
		const response = await fetch('http://localhost:42069/signup', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ username, password })
		});

		if (!response.ok) {
			const body = await response.json();
			return fail(response.status, body);
		}

		const { token } = await response.json();
		cookies.set('token', token, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			maxAge: 60 * 60 * 24 * 1000
		});
		// redirect to
		// make sure you don't throw inside a try/catch block!
		redirect(302, '/tweets');
	}
};
