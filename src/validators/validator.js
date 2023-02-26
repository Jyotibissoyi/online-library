const isValidemail = function (email) {
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/.test(email)
}

const isValidphone = function (phone) {
    const phoneRegex =  /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/.test(phone);
    return phoneRegex
  }

function checkPassword(str) {
    var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,15}$/;
    return re.test(str);
}

const isValid=function(name){
    const value = /^[a-zA-Z( \)]{2,50}$/
    return value.test(name)
}

const isEmpty = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
};

const isValidpincode=function validatePIN (pincode) {
      return /^(\d{4}|\d{6})$/.test(pincode)
  
  }
const isValidISBN=function(ISBN) {
    return /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/.test(ISBN);
}

const israting=function(rating){
    return /^[1-5]{1}$/.test(rating)
}

module.exports={isValidemail,isValidphone,checkPassword, isValid,isValidpincode,isEmpty,isValidISBN ,israting}




