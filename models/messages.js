const mongoose = require('mongoose');

const messageSchema = mongoose.Schema ({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    content: String,
    date: Date,
    likes: Number,
    hashtag: String,
})

const Message = mongoose.model('messages', messageSchema);

module.exports= Message