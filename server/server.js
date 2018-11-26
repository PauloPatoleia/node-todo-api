// External dependencies
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb')
const _ = require('lodash')
const {authenticate} = require('./middleware/authenticate')

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
 

app.patch('/todos/:id', (req, res) => {
  var id = req.params.id 
  var body = _.pick(req.body, ['text', 'completed']);

  if(!ObjectID.isValid(req.params.id)) {
    return res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if(!todo) {
      return res.status(404).send()
    }

    res.send({todo});

  }).catch(err => {
    res.status(404).send()
  })


})

app.post('/users', (req, res) => {

  const body = _.pick(req.body, ['email', 'password']);

  const user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken()
  }).then((token) => {
    res.header('x-auth', token).send(user)
  }).catch((err) => {
    res.status(400).send(err)
  });
})



app.listen(port, () => {
  console.log(`Started on port ${port}`);
}); 

module.exports = {app};
