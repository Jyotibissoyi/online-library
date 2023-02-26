const mongoose = require('mongoose');


const BookSchema = mongoose.Schema({
   bookCover: String,
   title: {
      type: String,
      required: true,
      unique: true
   },


   excerpt: {
      type: String,
      required: true
   },

   userId: {
      ref: 'user',
      type: mongoose.Schema.Types.Mixed
   },

   ISBN: {
      type: String,
      required: true,
      unique: true
   },
   category: {
      type: String,
      required: true
   },
   subcategory:
   {
      type: [],
      required: true
   },
   reviews: {
      type: Number,
      default: 0
   },
   isDeleted: {
      type: Boolean,
      default: false
   },
   DeletedAt: {
      type: String
   },
   releasedAt: {
      type: String
   }

}, { timestamps: true });

module.exports = mongoose.model('Book', BookSchema);