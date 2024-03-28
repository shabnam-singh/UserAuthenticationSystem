const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    phone: { type: String, unique: true },
    password: String,
    pImage: String,
},{timestamps:false});

module.exports = mongoose.model('User', userSchema);
