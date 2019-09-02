const polka = require('polka');
const db = require('../util/db');
const apiApp = polka();

async function getMe (request) {
	const redditorInfo = (await request.reddit().get('/api/v1/me')).body;
	return {
		name: redditorInfo.name,
		avatar: redditorInfo.subreddit.icon_img,
	};
}

apiApp.get('/me', async (request, response) => {
	if (!request.session.redditAccessToken) {
		return response.json(401);
	}
	try {
		response.json(await getMe(request));
	} catch (error) {
		response.error(error);
	}
});

apiApp.get('/response', async (request, response) => {
	if (!request.session.redditAccessToken) {
		return response.json(401);
	}
	try {
		const me = await getMe(request);
		response.end(db.getUserResponse(me.name).data);
	} catch (error) {
		response.error(error);
	}
});

apiApp.post('/response', async (request, response) => {
	if (!request.session.redditAccessToken) {
		return response.json(401);
	}
	try {
		const body = await request.body();
		if (!body.match(/^(\d{1,8},){0,9}\d{1,8}$/)) {
			response.error(400, 'Invalid response (yell at /u/geo1088)');
		}
		const me = await getMe(request);
		db.updateUserResponse({
			reddit: me.name,
			data: body,
		});
		response.empty();
	} catch (error) {
		response.error(error);
	}
});

apiApp.delete('/response', async (request, response) => {
	if (!request.session.redditAccessToken) {
		return response.json(401);
	}
	try {
		const me = await getMe(request);
		db.deleteUserResponse(me.name);
		response.empty();
	} catch (error) {
		response.error(error);
	}
});

module.exports = apiApp;
