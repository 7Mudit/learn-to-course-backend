const express = require('express')
const app = express()
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
require('dotenv').config()
const userRoutes = require('./routes/User')
const courseRoutes = require('./routes/Course')
const contactRoutes = require('./routes/Contact')
// connecting database
require('./config/databse').dbConnect()


// middleware
app.use(express.json())
app.use(cookieParser());
app.use(
	fileUpload({
		useTempFiles:true,
		tempFileDir:"/tmp",
	})
)
app.use(
	cors({
		origin:true,
	})
)

app.use('/api/v1/auth/',userRoutes)
app.use('/api/v1/course/',courseRoutes)
app.use('/api/v1/contact' , contactRoutes)


app.use('/' , (req,res) => {
    console.log(`This is working actually`)
})

app.listen(process.env.PORT , () => {
    console.log(`App running at ${process.env.PORT}`)
})