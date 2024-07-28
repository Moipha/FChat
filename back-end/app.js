const express = require("express");

const index = require('./router/index')
const {port} = require('./config')

const app = express()

app.use('/test', index)

app.listen(port, ()=>{
    console.log('Server is running...')
})