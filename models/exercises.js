'use strict'
const mongoose = require('mongoose')
//creating schema
const Schema = mongoose.Schema
//creating model
var Exercises = new Schema({
username:String,
userId:{
    type: String,
    ref: 'Users',//to take data from another model
    index: true
},
description:{
    type: String,
    required: true,//required field
    maxlength: [30, 'description too long']//max characters for the prop and response if exceeds
},
duration:{
    type: Number,
    required: true,//required field
    min: [1, 'duration too short']
},
date:{
    type: Date,
    default: Date.now//or new Date()//taking current date if not entered
} 
})
// validate userId, and add "username" to the exercise instance
Exercises.pre('save', function(next) {
  mongoose.model('Users').findById(this.userId, (err, user) => {
    if(err) return next(err)
    if(!user) {
      const err = new Error('unknown userId')
      err.status = 400//400 error stands for bad request>>https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
      return next(err)
    }
    this.username = user.username
    if(!this.date) {
      this.date = Date.now()
    }
    next();
  })
})

//exporting model module to be availble
module.exports = mongoose.model('Exercises', Exercises)