const mongoose= require('mongoose')
const schema = mongoose.Schema();

const UserSchema = new schema ({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type:String,
        required: true
    },
   avatar:{
      type: String
   },
   date:{
       type:Date,
       default:Date.now
   }
})
module.exports = mongoose.model('User',UserSchema)