// 'C:\Users\ssadh\Documents\mongodb\bin\mongod.exe' --dbpath='C:\Users\ssadh\Documents\mongodb-data'

const mongoose = require('mongoose')

mongoose.connect( process.env.MONGODB_URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})