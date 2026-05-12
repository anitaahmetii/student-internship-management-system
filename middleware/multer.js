const multer = require("multer");
const path = require('node:path');
const fs = require('node:fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) 
  {
    cb(null, path.join(__dirname, "../public/uploads"));
  },
  filename: function (req, file, cb) 
  {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "application/pdf" && path.extname(file.originalname) === '.pdf') cb(null, true);
    else 
    {
        const error = new Error("Only PDF files are allowed!");
        error.code = "INVALID_FILE_TYPE";
        cb(error, false);
    }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;