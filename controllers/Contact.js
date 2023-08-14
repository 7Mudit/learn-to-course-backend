const mongoose = require("mongoose");
const Contact = require("../models/Contact");

const mailSender = require("../utils/mailSender");
const {contactUsEmail} = require("../mail/templates/contactFormRes");
const {contactUsEmailForMe} = require("../mail/templates/contactEntryForMe");

// making a post controller to make changes in the database
exports.saveMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(404).json({
        success: false,
        message: "All fields are mandatory",
      });
    }

    const userMessage = await Contact.create({ name, email, message });

    // after entry has been created in database send user the confirmation mail and me too
    await mailSender(
      email,
      "Your message has been received by us successfully ",
      contactUsEmail(email, name, message)
    );
    // this email will let me know regarding a user who has tried to contact me
    await mailSender(
      "muditk441@gmail.com",
      "Message has been sent to you by a user ",
      contactUsEmailForMe(email, name, message)
    );

    return res.status(200).json({
      success: true,
      message: "Your message was sent succesfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
