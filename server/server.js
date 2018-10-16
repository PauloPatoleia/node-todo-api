const mongoose = require('mongoose');

mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/TodoApp'), { useNewUrlParser: true } ;

const Todo = mongoose.model('Todo', {
    text: {
        type: 'String'
    },
    completed: {
        type: 'Boolean'
    },
    completedAt: {
        type: 'Number'
    }

});

var newTodo = new Todo({
    text: 'Cook dinner'
})

newTodo.save().then((doc) => {
    console.log('saved todo: ' + doc);
    
}, (e) => {
    console.log('unable to save todo')
})

// cd "Program Files\MongoDB\Server\4.0\bin"
// mongod --port 27017 --dbpath "C:\Users\vmpat\mongo-data"