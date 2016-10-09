/**
 * Created by dylanaird on 9/10/16.
 */
// load the needed files
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create the user schema
var commentSchema = new Schema({
    title: String,
    body: String,
    user_id: String, // link the user to the comment
    parent_id: String, // used if the comment is a reply
    created_at: Date,
    updated_at: Date
});


// create model from schema we need to create a model using it
var Comment = mongoose.model('Comment', commentSchema);

// make this available to our users in our Node applications
module.exports = Comment;