const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema({
    bookId: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
        ref: 'Book'
    },
    reviewedBy: {
        type: String,
        required: true,
        default: 'Guest'
    },

    rating: {
        type: Number,
        required: true
    },
    review: String,

    reviewedAt: {
        type: String,
        required: true
    },
     isDeleted :{
        type: Boolean ,
        default : false
     }

}, { timestamp: true })

module.exports = mongoose.model("review", reviewSchema)