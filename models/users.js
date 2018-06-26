'use strict';
/**
 * Student Model
 **/
 var mongoose = require('mongoose'),
 Schema = mongoose.Schema,
 bcrypt = require('bcrypt'),
 moment = require('moment');

 var usersSchema = new Schema({
  name   : String,
  email       : {
    type      : String,
    unique    : true,
    lowercase : true,
    required  : true
  },
  gender      : {
    type      : String,
    enum      : ['female', 'male']
  },
  type        : String,
  phoneNumber : String,
  isVerified  : {
    type : Boolean,
    default : false
  },
  password    : String,
  createdAt   : {
    type      : Date,
    default   : Date.now()
  },
  updatedAt   :  {
    type      : Date,
    default   : Date.now()
  },
  token: String
});

/**
* Set Global Virtual Attributes
**/



usersSchema.virtual('created').get(function(){
  return moment(this.createdAt.toISOString(), 'YYYY-MM-DDTHH:mm:ss.sssZ').format('MMMM Do YYYY, h:mm a');
});

usersSchema.virtual('updated').get(function(){
  return moment(this.updatedAt.toISOString(), 'YYYY-MM-DDTHH:mm:ss.sssZ').format('MMMM Do YYYY, h:mm a');
});

usersSchema.set('toObject', { virtuals: true });

/**
* Set Global Methods
**/

usersSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

usersSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('users', usersSchema);
