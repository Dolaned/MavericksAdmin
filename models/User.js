/**
 * Created by dylanaird on 9/10/16.
 */
// load the needed files
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create the user schema
var userSchema = new Schema({
    firstname: String,
    lastname: String,
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true},
    admin: Boolean,
    created_at: Date,
    updated_at: Date
});


// create model from schema we need to create a model using it
var User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
module.exports = User;