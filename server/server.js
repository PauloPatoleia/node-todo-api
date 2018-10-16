const mongoose = require('mongoose');

mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }) ;

const Todo = mongoose.model('Todo', {
    text: {
        type: 'String',
        required: true,
        minlenght: 1,
        trim: true
    },
    completed: {
        type: 'Boolean',
        default: false
    },
    completedAt: {
        type: 'Number',
        default: null
    }

});

const User = mongoose.model('User', {
    email: {
        type: 'String',
        trim: true,
        minlenght: 1,
        required: true
    }
})

var newTodo = new User({
    email: '  '
})

newTodo.save().then((doc) => {
    console.log('saved todo: ' + doc);
    
}, (e) => {
    console.log('unable to save todo')
})

// cd "Program Files\MongoDB\Server\4.0\bin"
// mongod --port 27017 --dbpath "C:\Users\vmpat\mongo-data"