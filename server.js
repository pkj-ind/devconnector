const express=require("express");
const app = express()
const connectDB =require('./config/db')

connectDB();
app.get('/',(req,res)=>{
    console.log(req.params)
    res.send("Api Running !!")
})

//Define Routes
app.use('/api/users',require('./routes/api/users'))
app.use('/api/auth',require('./routes/api/auth'))
app.use('/api/profile',require('./routes/api/profile'))
app.use('/api/posts',require('./routes/api/posts'))

app.listen(3000,()=>{
    console.log("Successfully Connected!!!")
})