const express=require('express');
const router=express.Router();
const Post=require('../DB/postschema');
const flash=require('connect-flash')
const Form_data=require('../DB/schema')



router.post('/:id', async (req,res)=>{
    try{
        console.log(req.params.id)
        var id=req.params.id;
        console.log("userrrr");
        await Post.create(req.body)
       return res.redirect(`/login/home/${id}`)
    }catch(err){
        console.log(err);

    }
})



// show edit page
//GET /stories/edit/:id
router.get('/editpage/:id', async(req,res)=>{
    var id=req.params.id;
    const post=await Post.findOne({
        _id: req.params.id
    }).lean()
    if(!post)
    {
        console.log("error in edit page");
    }
    else{
        console.log("sagdja");
        res.render('editpage',
        {
            post,id
            
        })
    }
})




// PUT request
// route PUT /stories/id
router.put('/editpage/:id',async (req,res)=>{
    console.log("innnnnn")
    var id=req.params.id;
    var post= await Post.findById(req.params.id).lean()
    
    if(!post)
    {
        console.log("error hai ")   
    }
    else{

        story= await Post.findOneAndUpdate({ _id : req.params.id }, req.body ,{ new : true })
        console.log(story);
        // console.log("*************");
        res.redirect(`/login/home/${id}`);
    }
})


// DELETE request
// route DELETE /stories/id
router.delete('/delete/:id' , async (req,res)=>{
try{
    var id=req.params.id;
    await Post.findByIdAndRemove({_id: req.params.id})
    res.redirect(`/login/home/${id}`)
}catch(err){
    console.log(err);
}
})



module.exports=router;