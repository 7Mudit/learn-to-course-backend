const mongoose = require('mongoose')

const CourseSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    sections : [
        {
            type : mongoose.Schema.Types.ObjectId ,
            ref: 'Section'
        }
    ]
})

module.exports = mongoose.model("Course" , CourseSchema)

