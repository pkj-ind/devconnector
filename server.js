const express=require("express");
const app = express()
app.get('/',(req,res)=>{
    console.log(req.params)
    res.send("Api Running !!")
})
app.listen(3000,()=>{
    console.log("Successfully Connected!!!")
})