import { fail, redirect } from '@sveltejs/kit';

import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (session) throw redirect(302, '/tweets');
	return {};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form_data = await request.formData();
		const username = form_data.get('username');
		const password = form_data.get('password');
		// basic check
		if (typeof username !== 'string' || username.length < 1 || username.length > 31) {
			return fail(400, {
				message: 'Invalid username'
			});
		}
		if (typeof password !== 'string' || password.length < 1 || password.length > 255) {
			return fail(400, {
				message: 'Invalid password'
			});
		}

		throw redirect(302, '/tweets');
	}
};
