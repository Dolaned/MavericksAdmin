// load the needed files
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create the user schema
var movieSchema = new Schema({
    omdbid: String,
    created_at: Date
});


// create model from schema we need to create a model using it
var Movie = mongoose.model('Movie', movieSchema);

// make this available to our users in our Node applications
module.exports = Movie;