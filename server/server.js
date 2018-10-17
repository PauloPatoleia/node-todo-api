// 3RD PARTY
const express = require('express')
const bodyParser = require('body-parser') 
// LOCAL
const {mongoose} = require('./db/mongoose')
const {Todo} = require('./models/todo')
const {User} = require('./models/user')

var app = express()
app.use(bodyParser.json())

// cd \
// cd "Program Files\MongoDB\Server\4.0\bin"
// mongod --port 27017 --dbpath "C:\Users\vmpat\mongo-data"


app.post('/todos', (req, res) => {
    let todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e)
    })

})




app.listen(3000, () => {
    console.log('Started on port 3000');
    
})