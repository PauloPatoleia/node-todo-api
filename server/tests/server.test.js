const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb')

const {app} = require('./../server');
const {Todo} = require('./../models/todo');


// Placeholder todos for testing
const todos = [{
  _id: new ObjectID(),
  text: 'first test todo'
}, {
  _id: new ObjectID(),
  text: 'second test todo',
  completed: true,
  completedAt: 333
}]

// db configs before each test
beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
});

// POST TESTS
describe('POST /todos', () => {

  // 
  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        // Checks to see if it finds the todo created
        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });

  // 
  it('should not create todo with invalide body data', (done) => {
    
    request(app)
    .post('/todos')
    .send({})
    .expect(400)
    .end((err, res) => {
        if (err) {
          return done(err);
        }
  // Checks to see if no todos were added
        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => done(e));
      });
  })
});

// GET TESTS
describe('GET /todos', () => {

  //
  it('should get all todos', (done) => {

    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2)
      })
      .end(done)

  })
})

// GET 

describe('GET /todos/:id', () => {

  it('should return a todo', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  })

  it('should return a 404 if todo not found', (done) => {
    let hexId = new ObjectID().toHexString()
    request(app)
      .get(`/todos/${hexId}`)
      .expect(404)
      .end(done)
  })

  it('should return 404 for none object ids', (done) => {
    request(app)
      .get(`/todos/1234`)
      .expect(404)
      .end(done)
  })
})

describe('DELETE /todos:id', () => {

  var hexId = todos[1]._id.toHexString();

  it('should remove a todo', (done) => {

    request(app)
    .delete(`/todos/${hexId}`)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo._id).toBe(hexId)
    })
    .end((err, res) => {
      if (err) {
        return done(err)
      }

      Todo.findById(hexId).then((todo) => {
        expect(todo).toNotExist()
        done()
      }).catch(err => {
        done(err)
      })

    })

  })

  it('should return 404 if todo not found', (done) => {
    let hexId = new ObjectID().toHexString()
    request(app)
      .delete(`/todos/${hexId}`)
      .expect(404)
      .end(done)
  })

  it('should return 404 if objectId is invalid', (done) => {
    request(app)
    .delete(`/todos/1234`)
    .expect(404)
    .end(done)
  })

})

describe('PATCH /todo/:id', () => {

  it('should update the todo', (done) => {

    var hexId = todos[0]._id.toHexString();

    request(app)
      .patch(`/todos/${hexId}`)
      .send({text: 'new text',
              completed: true})
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe('new text')
        expect(res.body.todo.completed).toBe(true)
        expect(typeof res.body.todo.completedAt).toBe("number")
      })
      .end(done)
   
  })

  it('should clear completedAt when todo is not completed', (done) => {

    var hexId = todos[1]._id.toHexString()
    
    request(app)
    .patch(`/todos/${hexId}`)
    .send({text: 'old text',
            completed: false})
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe('old text')
      expect(res.body.todo.completed).toBe(false)
      expect(res.body.todo.completedAt).toNotExist()
    })
    .end(done)

  })
})



