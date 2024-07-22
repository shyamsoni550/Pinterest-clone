
const mongoose = require('mongoose');
// Define the post schema
const postSchema = new mongoose.Schema({
imageText: {
type: String,
required: true,
},
user:
{
     type:mongoose.Schema.Types.ObjectId,
     ref:'User'
},
image:{
     type:String
},
createdAt: {
type: Date,
default: Date.now,
},
likes: {
type: Array,
default: [],
},
});
// Create the post model
module.exports = mongoose.model('Post', postSchema);

