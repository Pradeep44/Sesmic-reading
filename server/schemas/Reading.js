const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const readingSchema = new Schema(
    {
        day: String,
        month: String,
        year: String,
        frequency: [Number],
    },
    { timestamps: true },
)

const Reading = mongoose.model('Reading', readingSchema);

module.exports = Reading;