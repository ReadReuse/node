const mongoose = require('mongoose');
const dotenv = require('dotenv')

dotenv.config()

const connectToDB = () => {
    mongoose.set('strictQuery', true);
    mongoose.connect(process.env.MONGO_URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    }).then(() => {
        console.log('connected to mongodb');
    }).catch((err) => console.log("Error in connecting mongo db:", err))
}

module.exports = connectToDB;