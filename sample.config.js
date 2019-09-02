const path = require('path');

const port = process.env.PORT || 4567;

module.exports = {
	// Server location
	host: `http://localhost${port === 80 ? '' : `:${port}`}`, // TODO wat
	port,
	// Directory where the compiled frontend goes
	publicDir: path.join(__dirname, 'public'),
	// Reddit OAuth credentials
	reddit: {
		clientId: 'Reddit application client ID',
		clientSecret: 'Reddit application client secret',
		userAgent: 'web:user/repo:0.0.1 (by /u/YOURNAMEGOESHERE)',
	},
};
