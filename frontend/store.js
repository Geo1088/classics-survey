import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

async function makeRequest (path, method = 'GET', body) {
	if (typeof body === 'object' && body !== null) {
		body = JSON.stringify(body);
	}
	const result = await fetch(path, {method, body});
	if (!result.ok) {
		throw await result.text();
	}
	if (result.status === 204) {
		return;
	}
	return result;
}
function makeRequestJSON (...args) {
	return makeRequest(...args).then(result => result.json());
}
function makeRequestBody (...args) {
	return makeRequest(...args).then(result => result.text());
}

const store = new Vuex.Store({
	state: {
		me: undefined,
		response: undefined,
	},
	mutations: {
		GET_ME (state, me) {
			state.me = me;
		},
		GET_RESPONSE (state, response) {
			state.response = response;
		},
	},
	actions: {
		async getMe ({commit}) {
			commit('GET_ME', await makeRequestJSON('/api/me').catch(() => null));
		},
		async getResponse ({commit}) {
			commit('GET_RESPONSE', await makeRequestBody('/api/response').catch(() => null));
		},
	},
});

export default store;
