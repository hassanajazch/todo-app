const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../helpers/auth');
const uuidv1 = require('uuid/v1');
const todoStore = require('../models/Todo');

// load helper


// load schema
require('../models/Todo');
const Todo = mongoose.model('todos');

// Todo Index Page
router.get('/', ensureAuthenticated, (req,res) => {
  todoStore.getAll(req.user.id).then(todos => {
    res.render('todos/index', {
      todos:todos
    })
  });
});



// add todo form
router.get('/add', ensureAuthenticated, (req,res) => {
  res.render('todos/add');
});

// edit todo form
router.get('/edit/:uuid', ensureAuthenticated, (req,res) => {
  todoStore.getOne(req.params.uuid).then(todo => {
    res.render('todos/edit', {
      todo:todo
    })
  });
});

// process  form
router.post('/', ensureAuthenticated, (req,res) => {
  todoStore.add(req.body, req.user.id).then(todo => {
    if(todo.error) {
      res.render('todos/add', todo);
    } else {
      req.flash('success_msg', 'Todo added');
      res.redirect('/todos');
    }
  });
});

// edit form process
router.put('/:uuid', ensureAuthenticated, (req,res) => {
  todoStore.update(req.params.uuid, req.body).then(response => {
    req.flash('success_msg', 'Todo removed');
    res.redirect('/todos');
  });
});

// delete Todo
router.delete('/:uuid', ensureAuthenticated, (req,res) => {
  todoStore.remove(req.params.uuid).then(response => {
    req.flash('success_msg', 'Todo removed');
    res.redirect('/todos');
  });
});



module.exports = router;
