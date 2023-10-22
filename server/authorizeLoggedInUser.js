const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

function authorizeLoggedInUser(req, res, next) {
	const { authorization } = req.headers;
	if (!authorization) {
		return res.status(401).json({ error: 'Unauthorized. Please log in.' });
	}

	const token = authorization.replace('Bearer ', '');
	if (!token) {
		return res.status(401).json({ error: 'Unauthorized. Please log in.' });
	}

	try {
		// Verify and decode the JWT token
		const userId = jwt.verify(token, JWT_SECRET);

		req.userId = userId;

		// Continue to the next middleware or route handler
		next();
	} catch (error) {
		return res.status(401).json({ error: 'Invalid token. Please log in again.' });
	}
}

module.exports = authorizeLoggedInUser;
