'use strict'

const mongoose = require('mongoose')
//requiring module to generate short ids
const shortid = require('shortid')
//creating schema
const Schema = mongoose.Schema
//creating model
var Users = new Schema({
username:{
    type: String, 
    required: true,//required field
    unique: true,//not to duplicate names 
    maxlength: [20, 'username too long']//max name length and message if exceeds
},
_id:{
    type: String,
    index: true,
    default: shortid.generate//creats short id
}
})
//exporting model module to be availble
module.exports = mongoose.model('Users', Users)