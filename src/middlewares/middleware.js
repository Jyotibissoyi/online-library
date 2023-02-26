const jwt = require('jsonwebtoken');
const { isValidObjectId } = require('mongoose');
const bookModel = require('../models/bookModel');


const authenticate = function (req, res, next) {
   try {
      const header = req.headers["x-api-token"]
      if (!header) 
         return res.status(404).send({ status: false, message: "Token Is Missing" })

         const verify = jwt.verify(header, "Neemo")
         if (!verify) 
         return res.status(401).send({ status: false, message: "Invalid token" })
            req.verify = verify
            next()
       
   }
   catch (err) {
      res.status(500).send({ status: false, message: err.message })
   }
}


const authorize = async function (req, res, next) {
   try {
      let UserId = req.body.userId
      if (!UserId) {
         let BookId = req.params.bookId
         if (!BookId) { return res.status(404).send({ status: false, message: "id is required" }) }
         if (!isValidObjectId(BookId)) { return res.status(400).send({ status: false, message: "Enter valid bookId" }) }
         let bookDetails = await bookModel.findById(BookId)
         if (!bookDetails) { return res.status(404).send({ status: false, message: "book is not present" }) }
         let auth = bookDetails.userId
         if (auth != req.verify.userId)
            return res.status(403).send({ status: false, message: "User is not authorized" })
         next()
      }
      else {
         if (!isValidObjectId(UserId)) { return res.status(400).send({ status: false, message: "enter valid userId" }) }
         let idfrmDecodedToken = req.verify.userId
         if (UserId != idfrmDecodedToken) { return res.status(403).send({ status: false, message: "Access Denied!(user needs to be authorized)" }) }
         next()
      }
   } catch (error) {
      return res.status(500).send({ status: false, message: error.message })

   }
}



module.exports = { authenticate, authorize }
