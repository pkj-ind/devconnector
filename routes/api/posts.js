const express = require('express')
const router = express.Router();
const auth = require('../../middleware/auth')
const {check, validationResult}=require('express-validator')
const config=require('config')
const User = require('../../models/Users');
const Profile = require('../../models/Profile');
const Post = require('../../models/Post');


// Route api/posts
// Create post
//Private

router.post('/',[auth,
check('text','Text is mandatory')
.not().isEmpty()
],
async (req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()})
    }   
     
    try {
        const user = await User.findById(req.user.id).select('-password')
        const newPost= new Post({
                text: req.body.text,
                name:user.name,
                avatar:user.avatar,
                user:req.user.id
            }
        );
        const post= await newPost.save()
        res.json(post)

   } catch (err) {
       console.error(err.message);
       res.status(500).send('Server error from post api')
   }
})
// @route GET api/posts
// Description: Get all posts
// Access Private

router.get('/',auth,async(req,res)=>{
    try {
        const posts= await Post.find().sort({date:-1})
        res.json(posts)
    } catch (err) {
        console.error(err.message);
       return res.status(500).send('Error while pulling all posts')
    }
})

// @route GET api/posts/:post_id
// Description: Get post by id
// Access Private

router.get('/:post_id',auth,async(req,res)=>{
    try {
        const post= await Post.findById(req.params.post_id)
        if(!post){
            return res.status(404).json({msg:"post not found"})
        }
        res.json(post)

    } catch (err) {
        if(err.kind=='ObjectId'){
            return res.status(400).json({msg:"Invalid ObjectId"})
        }
        console.error(err.message);
        res.status(500).send('Error while pulling with post_id')
    }
})

// @route DELETE api/posts/:post_id
// Description: Delete a post
// Access Private

router.delete('/:post_id',auth,async(req,res)=>{
    try {
        const post= await Post.findById(req.params.post_id)

        if(!post){
            return res.status(404).json({msg:"post not found"})
        }
      // check user
        if(post.user.toString() !== req.user.id){
            return res.send(401).json({msg:'User not authorized'})
        }
        await post.remove();
        res.json({msg:'Post removed'})

    } catch (err) {
        if(err.kind =='ObjectId'){
            return res.status(400).json({msg:"Invalid ObjectId"})
        }
        console.error(err.message);
       return res.status(500).send('Error while pulling all posts')
    }
})

// @route PUT api/post/like/:id 
//Description: Like a post
//Access auth

router.put('/like/:id',auth,async(req,res)=>{
try {
    const post= await Post.findById(req.params.id);
    // check if user already liked
    if(post.likes.filter(like=>like.user.toString() === req.user.id).length > 0)
    {
        return res.status(400).json({msg:'Post already liked'})
    }
    post.likes.unshift({user:req.user.id});
    await post.save();

    res.json(post.likes)

} catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error while linking a post')
}
})

// @route PUT api/post/unlike/:id 
//Description: UnLike a post
//Access auth

router.put('/unlike/:id',auth,async(req,res)=>{
    try {
        const post= await Post.findById(req.params.id);
        // check if user already liked
        if(post.likes.filter(like=>like.user.toString() === req.user.id).length === 0)
        {
            return res.status(400).json({msg:'Post has not yet been liked'})
        }
        
        // Get remove index

        const removeIndex= post.likes.map(like =>{
            like.user.toString()
        }).indexOf(req.user.id);

        post.likes.splice(removeIndex,1)

        await post.save();
    
        res.json(post.likes)
    
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error while Unlinking a post')
    }
    })


// Route api/posts/comment/:id
// Create Comments on post
//Private

router.post('/comment/:id',[auth,
    check('text','Text is mandatory')
    .not().isEmpty()
    ],
    async (req,res)=>{
        const errors = validationResult(req)
        if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
        }   
         
        try {
            const user = await User.findById(req.user.id).select('-password')
            const post = await Post.findById(req.params.id)
            const newComment= {
                    text: req.body.text,
                    name:user.name,
                    avatar:user.avatar,
                    user:req.user.id
                }
            post.comments.unshift(newComment)

            await post.save()
            res.json(post.comments)
    
       } catch (err) {
           console.error(err.message);
           res.status(500).send('Server error from post api')
       }
    })

// Route api/posts/comment/:id/:comment_id
// Create Comments on post
//Private

router.delete('/comment/:id/:comment_id',auth,
    async (req,res)=>{
        const errors = validationResult(req)
        if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
        }   
         
        try {
            //const user = await User.findById(req.user.id).select('-password')
            const post = await Post.findById(req.params.id)
            //pull out comment
            const comment=await post.comments.find(comment=>comment.id===req.params.comment_id);
            if(!comment){
                return res.status(404).json({msg:'Comment does not exit'})
            }
            //check user
            if(comment.user.toString() !== req.user.id){
                return res.status(401).json({msg:'User not authorized'})
            } 

            const removeIndex =post.comments.map(comment=>comment.user.toString())
            .indexOf(req.user.id);

            post.comments.splice(removeIndex,1);

            res.json(post.comments)
            
    await post.save();

       } catch (err) {
           console.error(err.message);
           res.status(500).send('Server error from post api')
       }
    })

module.exports = router;