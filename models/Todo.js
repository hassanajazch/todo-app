const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uuidv1 = require('uuid/v1');

// create schema
const TodoSchema = new Schema({
  uuid: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true
  },
  creationDate: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: String
  }
});

const todoModel = mongoose.model('todos', TodoSchema);

class TodoItemStore {
    /**
     *
     * @returns {Promise<TodoItem[]>}
     */
    static async getAll(userId) {
        try {
            const todoItems = await todoModel.find({user: userId}).exec();
            return todoItems
        } catch (err) {
            return false;
        }
    }

    /**
     *
     * @returns {Promise<TodoItem[]>}
     */
    static async getOne(todoId) {
        try {
            const todoItems = await todoModel.findOne({uuid: todoId}).exec();
            return todoItems
        } catch (err) {
            return false;
        }
    }

    static async add(todo, userId) {
      try{
        let errors = [];

        if (!todo.title) {
          errors.push({
            text: 'Please add title'
          })
        }
        if (!todo.details) {
          errors.push({
            text: 'Please add some details'
          })
        }
        if (errors.length > 0) {
          return {
            errors: errors,
            title: todo.title,
            details: todo.details,
            dueDate: todo.duedate
          }
        } else {
            const newTodoItem = {
              title: todo.title,
              details: todo.details,
              user: userId,
              dueDate: todo.duedate,
              uuid: uuidv1()
            };

            try {
              const todoInstance = new todoModel(newTodoItem);
              await todoInstance.save();
              return true;
            } catch (err) {
                return false;
            }

          }
        } catch (err) {
          return false;
        }
      }

    /**
     *
     * @returns {Promise<TodoItem[]>}
     */
    static async update(itemId, todoItem) {
        try {
            const updatedtodoItem = {
              title: todoItem.title,
              details: todoItem.details,
              dueDate: todoItem.duedate
            }
            const result = await todoModel.findOneAndUpdate({uuid: itemId}, updatedtodoItem).exec();
            return result
        } catch (err) {
            return false;
        }
    }
    /**
     *
     * @returns {Promise<TodoItem[]>}
     */
    static async remove(itemId) {
        try {
            const todoItems = await todoModel.findOneAndDelete({uuid: itemId}).exec();
            return true
        } catch (err) {
            return false;
        }
    }
  }


module.exports = TodoItemStore;
