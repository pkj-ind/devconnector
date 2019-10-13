const express = require('express')
const router = express.Router();
const auth=require('../../middleware/auth')
const User = require('../../models/Users')
const bcrypt = require('bcryptjs')
const { check, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const config=require('config')

router.get('/',auth,async(req,res)=>{
    try{
const user = await User.findById(req.user.id).select('-password')
res.json(user)
    }catch(err){
    console.error(err.message);
    res.status(500).send('Server error from auth api')
    }
})
//@route    POST Route
//@desc     Authenticate user
//@access   Public
router.post('/',[
       check('email','please enter a valid email address')
    .isEmail(),
    check('password').exists()
  ],
async (req,res)=>{
    const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
 
   const {email,password} =req.body;
   try{
   // See if user exists
     let user= await User.findOne({email:email});
     //console.log(user);
     if(!user){
       res.status(400).json({errors:[{msg:'Invalid Email and Credentials pair'}]})
     }
     
  // password compare
 
const isMatch= await bcrypt.compare(password,user.password);
if(!isMatch){
    res.status(400).json({errors:[{msg:'Invalid email and Credentials pair'}]})
}

  // Return JSONwebauth
const payload ={
  user:{
    id:user.id
  }
}

jwt.sign(payload,config.get('jwtSecret'),
{expiresIn:36000},
(err,token)=>{
if(err) throw err;
console.log("You have successfully logged In and token assigned")
res.json({token})
})

   }catch(err){
   console.error(err.message);
    return res.status(500).send('Server error from auth api')
   }
})

module.exports = router;