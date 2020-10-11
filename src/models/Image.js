const { Schema, model } = require('mongoose');

const newSchema = new Schema({
    title : { type: String },
    description : { type: String },
    imageURL : { type: String },
    public_id : { type: String },
    //usaremos el tiempo en el que fue creada para agarrarlo con timeago.js
    created_at: {type: Date, default: Date.now()}
});

module.exports = model('Image', newSchema)