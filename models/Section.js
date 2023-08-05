const mongoose  =  require('mongoose')

const SectionSchema = new mongoose.Schema({
    name : {
        type : String , 
        required : true ,
    },
    subSections : [
        {
            type : mongoose.Schema.Types.ObjectId ,
            ref: 'SubSection'
        }
    ]
})

module.exports = mongoose.model("Section" , SectionSchema)

