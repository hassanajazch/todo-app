const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uuidv1 = require('uuid/v1');
const bcrypt = require('bcryptjs');

// create schema
const UserSchema = new Schema({
  uuid: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const userModel = mongoose.model('users', UserSchema);

class UserStore {
  /**
   *
   * @returns {Promise<TodoItem[]>}
   */
  static async add(user) {
      try {
        let errors = [];
        if (user.password != user.password2) {
          errors.push({text: 'Passwords do not match!'});
        }
        if (user.password.length < 4) {
          errors.push({text: 'Password must be at least 4 characters'});
        }
        if (errors.length > 0) {
          return {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
          }
        } else {
          const result = await userModel.findOne({email: user.email}).exec();
          if(result) {
            return {
              emailerror: true
            }
          } else {
            try {
              const newUser = new userModel({
                name: user.name,
                email: user.email,
                password: user.password,
                uuid: uuidv1()
              });

              const salt = await bcrypt.genSalt(10);
              const hash = await bcrypt.hash(newUser.password, salt);
              newUser.password = hash;
              const result = await newUser.save();
              return result;
            }catch (err) {
              return err;
            }
          }
        }

      } catch (err) {
          return false;
      }
  }
}

module.exports = UserStore;
