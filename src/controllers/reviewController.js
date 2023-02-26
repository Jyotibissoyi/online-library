const reviewModel = require('../models/reviewModel')
const bookModel = require("../models/bookModel")
const { isValidObjectId } = require("mongoose")
const moment = require("moment")

const { isValid, israting, isEmpty } = require("../validators/validator")


const createReview = async function (req, res) {
    try {
        let data = req.body
        const { review, rating, reviewedBy } = data
        let bookId = req.params.bookId;
        data.bookId = bookId
       
        data.reviewedAt = moment().format()

        if (!isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: "Invalid BookId" })
        }

        if (Object.keys(req.body).length == 0) {
            return res.status(400).send({ status: false, message: "Body can't be empty! Provide Data to create review" })
        }

        if (!review) {
            return res.status(400).send({ status: false, message: "Review is mandatory" })
        }

        if (review) {
            if (!isEmpty(review)) return res.status(400).send({ status: false, message: "Review is in Invalid Format" })
           
        }

        if (!rating) {
            return res.status(400).send({ status: false, message: "Rating is mandatory" })
        }
        if (rating) {
            if (!(typeof rating == "number")) {
                return res.status(400).send({ status: false, message: "Rating should be a number" })}
            }
        if (!israting(rating)) { return res.status(400).send({ status: false, message: "Rating should be minimum is 1 to maximum is 5" }) }
     

        if (!reviewedBy) {
            req.body.reviewedBy = "Guest"
        }

        if (reviewedBy) {
            if (!isValid(reviewedBy)) {
                return res.status(400).send({ status: false, message: "Your name is in Invalid Format" })
            }
        }

        const book = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!book) {
            return res.status(404).send({ status: false, message: "Book not found or deleted" })
        }


        const newReview = await reviewModel.create(data)
        const obj = {
            _id: newReview._id,
            bookId: newReview.bookId,
            reviewedBy: newReview.reviewedBy,
            reviewedAt: newReview.reviewedAt,
            rating: newReview.rating,
            review: newReview.review
        }
        const addReview = await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { $inc: { reviews: 1 } }, { new: true }).lean()
        addReview["reviewsData"] = obj

        return res.status(201).send({ status: true, message: "Review Added", data: addReview })
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

const updatereview = async function (req, res) {
    try {
        let bookId = req.params.bookId
        let review2 = req.params.reviewId
        let book = await bookModel.findById(bookId).lean()
        let reviewPresent = await reviewModel.findById(review2)

        let dataupdating = req.body
        let { reviewedBy, rating, review } = dataupdating
        
        
        if (!bookId) return res.status(400).send({ status: false, message: " enter the bookId " })
        if (!isValidObjectId(bookId))return res.status(400).send({ status: false, message: "enter valid bookId" })
        
        if (!book)return res.status(404).send({ status: false, message: " book is not found" })
        if (book.isDeleted == true)return res.status(404).send({ status: false, message: " book is already deleted" })
        if (!review2)return res.status(400).send({ status: false, message: "reviewId is not found in the params" })
        if (!isValidObjectId(review2)) return res.status(400).send({ status: false, message: "enter valid reviewId" })
        
        if (!reviewPresent) return res.status(404).send({ status: false, message: " review is not found " })
        if (reviewPresent.isDeleted == true) return res.status(400).send({ status: false, message: "review is already deleted" })
        if (!reviewPresent.bookId == bookId)return res.status(400).send({ status: false, message: "book cannot be updated" })

        if (Object.keys(dataupdating).length == 0) {return res.status(400).send({ status: false, message: "Enter the data you want to update" })}
        if (!isValid(reviewedBy)) {return res.status(400).send({ status: false, message: "Your name is in Invalid Format" })}
        if (rating) {
        if (!(typeof rating == "number")) {return res.status(400).send({ status: false, message: "Rating should be a number" })}}
        if (!israting(rating)) return res.status(400).send({ status: false, message: "Rating should be minimum is 1 to maximum is 5" })

        let dataupdated = await reviewModel.findOneAndUpdate({ _id: review2, isDeleted: false },
        { $set: { reviewedBy: reviewedBy, rating: rating, review: review } }, { new: true })
           
        book.reviewsData = dataupdated
        
        return res.status(200).send({ status: true, message: "review updated", data: book })
        }
    catch (err) {
    return res.status(500).send({ status: false, message: err.message })
    }
}

const deletereviewById = async function (req, res) {
    try {
        let bookId = req.params.bookId
        let reviewId = req.params.reviewId
        if (!bookId) return res.status(400).send({ status: false, msg: "Enter a book Id" })
        if (!isValidObjectId(bookId)) return res.status(400).send({ status: false, msg: "Enter a valid book Id" })
        if (!isValidObjectId(reviewId)) return res.status(400).send({ status: false, msg: "Enter a valid review Id" })
        
        let findbook = await bookModel.findById(bookId)
        
        if (!findbook) return res.status(404).send({ status: false, msg: "No such book found" })
        if (findbook.isDeleted == true) return res.status(404).send({ status: false, msg: "Book already deleted" })
        
        let findreview = await reviewModel.findById(reviewId)
        
        if (!findreview) return res.status(404).send({ status: false, msg: "No such review found" })
        if (!findreview.bookId == bookId)
            return res.status(400).send({ status: false, msg: "You can't delete this" })
        if (findreview.isDeleted) return res.status(404).send({ status: false, msg: "review already deleted" })
        
        let timeStamps = new Date()
        let reviewdelete = await reviewModel.findOneAndUpdate({ _id: reviewId, isDeleted: false }, { isDeleted: true, deletedAt: timeStamps })
        findbook.review -= 1 //review=review-1
        await findbook.save() //save review data
        
        res.status(200).send({ status: true, msg: "Review Deleted" })

         }
    catch (err) {
        res.status(500).send({ status: false, error: err.message });
    }
}




module.exports = { createReview, updatereview, deletereviewById }