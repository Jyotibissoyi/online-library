const { isValidObjectId } = require("mongoose")
const moment = require("moment")
const bookModel = require("../models/bookModel")
const userModel = require("../models/userModel")
const { isValidISBN, isEmpty } = require("../validators/validator")
const reviewModel = require("../models/reviewModel")



const createBooks = async function (req, res) {
  try {
    let { title, excerpt, userId, ISBN, category, subcategory } = req.body

    let data = req.body
    if (Object.keys(data).length == 0) { return res.status(400).send({ status: false, message: "Enter data in request body" }) }
    if (!userId) {
      return res.status(400).send({ status: false, message: "userId is mandatory" })
    }
    if (!isEmpty(userId))
      return res.status(400).send({ status: false, message: "userId cannot be empty " })

    if (!isValidObjectId(userId)) {
      return res.status(400).send({ status: false, message: "user id is not valid" })
    }

    let usercheck = await userModel.findById(userId)
    if (!usercheck) { return res.status(404).send({ status: false, message: "userId is not found " }) }
    data.releasedAt = moment().format()
    if (!title) {
      return res.status(400).send({ status: false, message: "title is mandatory" })
    }
    if (!isEmpty(title))
      return res.status(400).send({ status: false, message: "title cannot be empty " })
    if (!excerpt) {
      return res.status(400).send({ status: false, message: "excerpt is mandatory" })
    }
    if (!isEmpty(excerpt))
      return res.status(400).send({ status: false, message: "excerpt cannot be empty " })

    if (!userId) {
      return res.status(400).send({ status: false, message: "userId is mandatory" })
    }
    if (!isEmpty(userId))
      return res.status(400).send({ status: false, msg: "userId cannot be empty " })

    if (!ISBN) {
      return res.status(400).send({ status: false, msg: "ISBN is mandatory" })
    }
    if (!isEmpty(ISBN))
      return res.status(400).send({ status: false, msg: "ISBN cannot be empty " })

    if (!category) {
      return res.status(400).send({ status: false, msg: "category is mandatory" })
    }
    if (!isEmpty(category))
      return res.status(400).send({ status: false, msg: "category cannot be empty " })

    if (!subcategory) {
      return res.status(400).send({ status: false, msg: "subcategory is mandatory" })
    }
    if (!isEmpty(subcategory))
      return res.status(400).send({ status: false, msg: "subcategory cannot be empty " })


    if (!isValidISBN(ISBN)) {
      return res.status(400).send({ status: false, msg: "ISBN number is not valid" })
    }
    
    const titleCheck = await bookModel.findOne({ title })
    if (titleCheck) {
      return res.status(400).send({ status: false, message: "title already registered ,please use different title" })
    }
    const ISBNCheck = await bookModel.findOne({ ISBN })
    if (ISBNCheck) {
      return res.status(400).send({ status: false, message: "ISBN already registered, please use different ISBN" })
    }

    let bookCreated = await bookModel.create(req.body)
    res.status(201).send({ status: true, message: "Success", data: bookCreated })
  }
  catch (error) {
    res.status(500).send({ status: false, msg: error.message })
  }
}



const getbooks = async function (req, res) {
  try {
    const queryData = req.query

        if (queryData.userId == "") {
            return res.status(400).send({ status: false, message: "please provide an userId in userId field!" })
        }

        if (queryData.category == "") {
            return res.status(400).send({ status: false, message: "please provide category in category field!" })
        }

        if (queryData.subcategory == "") {
            return res.status(400).send({ status: false, message: "please provide subcategory in sbcategory field!" })
        }

        if (queryData.title == "") {
            return res.status(400).send({ status: false, message: "please provide title in title field!" })
        }

        if (queryData.ISBN == "") {
            return res.status(400).send({ status: false, message: "please provide ISBN in ISBN field!" })
        }


        //queryData["isDeleted"] = false //added isDeleted attribute in queryData

        const bookData = await bookModel.find(queryData).sort({ title: 1 }).select({ title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 }).sort({ title: 1 })

        if (bookData.length == 0) {
            return res.status(404).send({ status: false, message: "No book found!" })
        }


        return res.status(200).send({ status: true, message: "Books list", data: bookData })

  }
  catch (error) {
    return res.status(500).send({ status: false, messasge: error.message })
  }
}

const getbooksParams = async function (req, res) {
  try {
    let bookId = req.params.bookId
    if (!bookId)
      return res.status(400).send({ status: false, message: "Provide bookid for get the data" })
    if (!isValidObjectId(bookId))
      return res.status(400).send({ status: false, message: "Enter valid book id " })
     
      let data = await bookModel.findById({ _id: bookId, isDeleted: false })
      let reviewFind = await reviewModel.find({bookId:bookId , isDeleted:false}).select({isDeleted:0, createdAt:0, updatedAt:0})
    if (!data)
      return res.status(404).send({ status: false, message: "No such book found" })
   let reviewobj= data.toObject() 
   if(reviewFind){
    reviewobj["reviewsData"]=reviewFind 
   }
    return res.status(200).send({ status: true, message: "success", data: reviewobj })
  }
  catch (err) {
    return res.status(500).send({ status: false, message: err })
  }
}


const updateBook = async function (req, res) {
  try {
    let inputId = req.params.bookId
    if (!inputId)
      return res.status(400).send({ status: false, message: "book id required" })
    if (!isValidObjectId(inputId)) {
      return res.status(400).send({ status: false, message: "invalid bookId" })
    }
    let data = await bookModel.findById(inputId)
    if (!data)
      return res.status(404).send({ status: false, message: "Book does not exist" })
    if (data.isDeleted == true)
      return res.status(404).send({ status: false, message: "Book is deleted" })
    let details = req.body
    let { title, excerpt, releasedAt, ISBN } = details
     if (Object.keys(details).length == 0) {
      return res.status(400).send({ status: false, message: "Invalid request Please provide details" });}
     
    const titleCheck = await bookModel.findOne({ title })
    if (titleCheck) {
      return res.status(400).send({ status: false, message: "title already registered ,please use different title" })
    }
    const ISBNCheck = await bookModel.findOne({ ISBN })
    if (ISBNCheck) {
      return res.status(400).send({ status: false, message: "ISBN already registered, please use different ISBN" })
    }
    
    let books = await bookModel.findOneAndUpdate({ _id: inputId, isDeleted: false },
      { $set: { title: title, excerpt: excerpt, releasedAt: releasedAt, ISBN: ISBN } },
      { new: true })

    if (!books) return res.status(404).send({ status: false, message: "Book data not updated" })
    return res.status(200).send({status:true,message:"Success",data:books})
  }
  catch (error) {
    return res.status(500).send({ status: false, message: error.message })
  }
}


const deleteBookById = async function (req, res) {
  try {
    let bookId = req.params.bookId
    if (!isValidObjectId(bookId))
      return res.status(400).send({ status: false, message: "Enter a valid bookId" })
    let data = await bookModel.findById(bookId)
    if (!data)
      return res.status(404).send({ status: false, message: "No such book found" })
    if (data.isDeleted == true)
      return res.status(400).send({ status: false, message: "Book already deleted" })
    let timeStamps = new Date()
    await bookModel.findOneAndUpdate({ _id: bookId }, { isDeleted: true, deletedAt: timeStamps })
    res.status(200).send({ status: true, message: "Book is Deleted Successfully" })
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
}
module.exports = { createBooks, getbooks, getbooksParams, updateBook, deleteBookById }
  


