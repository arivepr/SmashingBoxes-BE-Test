const express = require('express');
const tasks = require('./routes/tasks');
const mongoose = require('mongoose');
const app = express();
const PORT = 3000;

/* 
	-----Welcome to our newly developed, fresh off the oven, more beautiful than a ferrari Tasks API-----
	*No coffee mugs were harmed in the process*

*/

mongoose.connect('mongodb://localhost/smashingbackends', {
	useFindAndModify: false,
	useUnifiedTopology: true,
	useNewUrlParser: true
})
	.then(console.log('Connected to our database... '));

app.use('/api/tasks', tasks);

app.get('/', (req, res) => {
	res.send('Welcome to Smashing Backends, where we`ll be smashing this backend test.');
})

app.listen(PORT, () =>{
	console.log(`Listening on port ${PORT}`);
})