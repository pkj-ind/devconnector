const express = require('express')
const router = express.Router();
const gravatar=require('gravatar')
const bcrypt = require('bcryptjs')
const { check, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const config=require('config')

const User=require('../../models/Users')
//@route    POST Route
//@desc     testing route
//@access   Public

router.post('/',[
    check('name','Name is mandatory')
    .not()
    .isEmpty(),
    check('email','please enter a valid email address')
    .isEmail(),
    // password must be at least 6 chars long
    check('password').isLength({ min: 6})
  ],
async (req,res)=>{
    const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
 
   const {name,email,password} =req.body;
   try{
   // See if user exists
     let user= await User.findOne({email});
     if(user){
       console.log('user already present')
       res.status(400).json({errors:[{msg:'User already exists'}]})
     }
  // Get gravatar
const avatar=gravatar.url(email,{
  s:'200',
  r:'pg',
  d:'mm'
})
user = new User({
  name,
  email,
  avatar,
  password 
})
  // Encrypt password
  console.log(user.name,user.email,user.avatar,user.password)
const salt= await bcrypt.genSalt(10);
user.password=await bcrypt.hash(user.password,salt)

console.log(user.name,user.email,user.avatar,user.password)
await user.save();
  // Retuen JSONwebauth
const payload ={
  user:{
    id:user.id
  }
}

jwt.sign(payload,config.get('jwtSecret'),
{expiresIn:36000},
(err,token)=>{
if(err) throw err;
//console.log('inside JSON web auth',token)
res.json({token})
})

 // res.send('User Registered')

   }catch(err){
   console.error(err.message);
   return res.status(500).send('Server error from user api')
   }

})

module.exports = router;