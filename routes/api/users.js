const express = require('express')
const router = express.Router();
const { check, validationResult } = require('express-validator');

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
(req,res)=>{
    const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
    console.log(req.body)
    res.send('User Route')
})

module.exports = router;