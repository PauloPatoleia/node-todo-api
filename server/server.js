// External dependencies
var express = require('express');
var bodyParser = require('body-parser');

// Local dependencies 
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

// Express setup
var app = express();
app.use(bodyParser.json());

// POST Route
app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});


// GET Route
app.get('/todos', (req, res) => {
    Todo.find({}).then((todos) => {
        res.send({todos})
    }, (e) => {
        res.status(400).send(e);
    })
})


app.listen(3000, () => {
  console.log('Started on port 3000');
});

module.exports = {app};
