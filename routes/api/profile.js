const express = require('express')
const router = express.Router();
const auth = require('../../middleware/auth')
const {check, validationResult}=require('express-validator')

// Load Profile Model
const Profile = require('../../models/Profile');
// Load User Model
const User = require('../../models/Users');

//GET api/profile/me
// Get Current user profile
// Private access

router.get('/me',auth,async(req,res)=>{
   try {
    const profile = await Profile.findOne({user:req.user.id})
    .populate('users',['name','avatar'])
    if(!profile){
        res.status(400).json({msg:'There is no profile found for this user'})
    }
     res.json(profile);

   } catch(err){
    console.error(err.message);
    return res.status(500).send('Server error from Profile api')
   }
    
    //res.send('Profile Route')
})

//POST request
//Private access
//create or update profile

router.post('/',[auth,[
    check('status','stats is required')
    .not()
    .isEmpty(),
    check('skills','skill is required')
    .not()
    .isEmpty()
    ]], async (req,res)=>{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
    
    //Build profile object
    const profileFields ={};
    profileFields.user = req.user.id;

    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername)
      profileFields.githubusername = req.body.githubusername;

     // Skills - Spilt into array
    if (req.body.skills) {
        profileFields.skills = req.body.skills.split(',').map(skill=>skill.trim())
      }
     console.log(profileFields.skills)
      // Social
      profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;
   
   try{
      let profile = await Profile.findOne({user:req.user.id})
      if(profile){
          //update
       profile=await Profile.findOneAndUpdate(
           {user:req.user.id},
           {$set:profileFields},
           {new:true}
       );
       return res.json(profile);
      }
      //create
      console.log("creating new profile")
      profile=new Profile(profileFields);
      await profile.save();
      res.json(profile)
   }catch(err){
     console.error(err.message)
     res.status(500).send('Server Error from profile api')
   }
    }
    
);

// GET api/profile
//desc Get all profiles
// access public

router.get('/',async (req,res)=>{
try {
    const profiles=await Profile.find().populate('Users',['name','avatar'])
    res.json(profiles);
} catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error')
}
})
// Get api/profile/user/:user_id
//access public
router.get('/user/:user_id',async(req,res)=>{
    try {
        const profile=await Profile.findOne({user:req.params.user_id})
        .populate('Users',['name','avatar'])
        if(!profile) {
            return res.status(400).json({msg:"There is no profile for this User"})
        }
        res.json(profile);
    } catch (error) {
        console.error(error.message);
        if(error.kind=='ObjectId'){
            return res.status(400).json({msg:"Invalid ObjectId"})
        }
        res.status(500).send('Server Error')  
    }
}
)

// Delete Profile, User and posts
//access private
router.delete('/',auth,async(req,res)=>{
    try {
    // @todo remove user posts
    console.log(req.user.id)
    //Remove profile
   await Profile.findOneAndRemove({user:req.user.id})
    
    //Remove User
    await User.findOneAndRemove({_id:req.user.id})

    res.json({msg:'User got deleted'})
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server error while deleting User data')
    }
    
})

module.exports = router;