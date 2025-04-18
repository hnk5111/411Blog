const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const CommentSchema = new Schema ({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post',
        required: true
    }
});

module.exports = mongoose.model('Comment', CommentSchema);