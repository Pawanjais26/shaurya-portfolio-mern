const express = require("express");
const router = new express.Router();
const users = require("../models/userSchema");
const nodemailer = require("nodemailer");

// email config
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL,
    pass: process.env.PASS,
  },
});

// Register user details
router.post("/register", async (req, res) => {
  const { fullName, email, mobile, message } = req.body;

  if (!fullName || !email || !mobile) {
    res.status(401).json({ status: 401, error: "All Input require" });
  }

  try {
    const preuser = await users.findOne({ email: email });
    if (preuser) {
      const userMessage = await preuser.Messagesave(message);
      console.log(userMessage);
      const mailOptions = {
        from: process.env.GMAIL,
        to: email,
        subject: "Sending Email Using Nodejs",
        text: "Your Response has been Submitted",
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("error" + error);
        } else {
          console.log("Email sent" + info.response);
          res
            .status(201)
            .json({ status: 201, message: "Email sent Successfully" });
        }
      });
    } else {
      const finalUser = new users({
        fullName,
        email,
        mobile,
        message,
      });
      const storeData = await finalUser.save();
      const mailOptions = {
        from: process.env.GMAIL,
        to: email,
        subject: "Sending Email Using Nodejs",
        text: "Your Response has been Submitted",
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("error" + error);
        } else {
          console.log("Email sent" + info.response);
          res
            .status(201)
            .json({ status: 201, message: "Email sent Successfully" });
        }
      });
      res.status(201).json({ status: 201, storeData });
    }
  } catch (error) {
    res.status(401).json({ status: 401, error: "All Input require" });
    console.log("catch Error");
  }
});

module.exports = router;
