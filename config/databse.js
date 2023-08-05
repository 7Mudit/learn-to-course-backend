const mongoose = require('mongoose')

exports.dbConnect = () => {
    mongoose.connect(process.env.DATABASE_URL ,{
        useNewUrlParser : true ,
        useUnifiedTopology : true
    })
    .then(() => console.log("App connected to database"))
    .catch((err) => console.log("App not able to connect to the database" , err))
}

