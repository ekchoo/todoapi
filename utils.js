const { format } = require("date-fns");
const debug = require("debug");

class Utils {
  // Method to validate MongoDB ObjectId
  static isValidObjectId(id) {
    const mongoose = require("mongoose");
    return mongoose.Types.ObjectId.isValid(id);
  }

  static getCurrentDateTime() {
    return format(new Date(), "yyyy-MM-dd HH:mm:ss");
  }

  // Method to format dates
  static formatDate(date, format = "YYYY-MM-DD") {
    const moment = require("moment");
    return moment(date).format(format);
  }

  // Method to generate a random string
  static generateRandomString(length = 10) {
    return require("crypto").randomBytes(length).toString("hex");
  }

  static log(msg) {
    debug.log(msg);
  }
}

module.exports = Utils;
