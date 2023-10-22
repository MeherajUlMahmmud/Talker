const mongoose = require('mongoose');

require('dotenv').config();

// Define the MongoDB connection URL. Replace 'your-database-connection-string' with your actual MongoDB connection string.
const mongoURI = process.env.MONGO_URI;

// Set up MongoDB options (optional, you can customize these as needed)
const mongoOptions = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
};

// Connect to the MongoDB database
mongoose.connect(mongoURI, mongoOptions)
	.then(() => {
		console.log('Connected to MongoDB');
	})
	.catch((err) => {
		console.error('Error connecting to MongoDB: ' + err);
	});

// Export the Mongoose connection for use in other parts of your application
module.exports = mongoose;
