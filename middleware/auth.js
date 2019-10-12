const express=require('express');
const jwt = require('jsonwebtoken')
const config = require('config')

module.exports= function (req,res,next){
//get token from header

const token= req.header('x-auth-token');
//check if not taken
if(!token){
    return res.status(401).json({msg:'No token, Authorization denied'})
}
//verify token
try{
    const decode=jwt.verify(token,config.get('jwtSecret'));
    req.user=decode.user;
    next()
}catch(err){
   res.status(401).json({msg:'Token is not valid'}) 
}
}