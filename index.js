const tasks = require('./routes/tasks');
const lists = require('./routes/lists');
const subtasks = require('./routes/subtasks');
const {_initiateDefaultList} = require('./models/lists.model');
const express = require('express');
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
	.then(() => {
		console.log('Connected to our database... ');
		// _initiateDefaultList();
	});

app.use('/api/tasks', tasks);
app.use('/api/lists', lists);
app.use('/api/subtasks', subtasks);


app.get('/', (req, res) => {
	res.send('Welcome to Smashing Backends, where we`ll be smashing this backend test.');

});

app.listen(PORT, () =>{
	console.log(`Listening on port ${PORT}`);
});


// For our list and subtasks dilemna
/* 
	Whenever we create a new task without a specified list, it should go to the default user list. Every user will have a default list, 
	similar to how OneNote has a default notebook for every single user. New stuff gets added there by default.  This way, we avoid problems
	with data integrity. We could have other options as well, such as only allowing new tasks do be done through the list api itself. 
	Whenever we create a new subtask, it should have with it the id of the selected (parent) task, and use that as populate for reference
*/