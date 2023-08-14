const express = require('express')
const router = express.Router()

const {saveMessage} = require('../controllers/Contact')

router.post('/contact-us', saveMessage)

module.exports = router