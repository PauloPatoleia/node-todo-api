// External dependencies
var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb')
// C:\Program Files\MongoDB\Server\4.0\bin
// mongod --port 27017 --dbpath "C:\Users\vmpat\mongo-data"
// Local dependencies 
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');


// Express setup
var app = express();
const port = process.env.PORT || 3000
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

// GET Individual TODO route
app.get('/todos/:id', (req, res) => {
  if(!ObjectID.isValid(req.params.id)) {
    return res.status(404).send();
  }

  Todo.findById(req.params.id).then((todo) => {
    
    if(!todo) {
      res.status(404).send()
    }
    
    res.send({todo})

  }).catch((err) => {
    res.status(404).send()
  })
})

app.delete('/todos/:id', (req, res) => {

  if(!ObjectID.isValid(req.params.id)) {
    return res.status(404).send();
  }

  Todo.findByIdAndRemove(req.params.id).then((todo) => {
    
    if(!todo) {
      res.status(404).send()
    }
    
    res.send({todo})

  }).catch((err) => {
    res.status(404).send()
  })
})
 



app.listen(port, () => {
  console.log(`Started on port ${port}`);
}); 

module.exports = {app};
