const express = require('express');
const tasks = require('./routes/tasks');
const mongoose = requir('mongoose');
const app = express();
const PORT = 3000;

/* 
	-----Welcome to our newly developed, fresh off the oven, more beautiful than a ferrari Tasks API-----
	*No coffee mugs were harmed in the process*

*/

app.use('api/tasks', tasks);

app.get('/', (req, res) => {
	res.send('Bienvenidos al Bori Task List');
})

app.listen(PORT, () =>{
	console.log(`Listening on port ${PORT}`);
})