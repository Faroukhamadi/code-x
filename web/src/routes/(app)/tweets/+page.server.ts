import { create, logout } from '$lib/server/actions';
import type { Actions } from '@sveltejs/kit';

export const actions: Actions = {
	create,
	logout
};
