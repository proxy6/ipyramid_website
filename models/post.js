const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PostSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,

    },
    author: {
        type: String,
        required: true,
    },
    tags: {
        type: [String]
    },
    date: {
        type: Date,
        default: new Date
    }

})

module.exports = mongoose.model('Post', PostSchema);