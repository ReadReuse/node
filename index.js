const app = require('./app');
const dotenv  = require('dotenv');
const connectToDB = require('./libs/mongoose');

dotenv.config({path: './config/.env'});

connectToDB();

const server = app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT || 5000}`)
})