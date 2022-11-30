const nodemailer = require("nodemailer");

  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.email",
    service: "gmail",
    auth: {
      user: "petsworld0290@gmail.com",
      pass: "zvrsrmzvoqiftdig",
    },
  });
module.exports = transporter;