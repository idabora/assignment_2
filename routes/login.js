const express=require('express');
const router=express.Router();
const Post=require('../DB/postschema');
const controller=require('../middleware/controller')
const flash=require('connect-flash')
const Form_data=require('../DB/schema')
const bcrypt=require('bcrypt');


router.get('/',(req,res)=>{
   res.render('login');
})

router.get('/home/:id',async (req,res)=>{

   try{
      var id=req.params.id;
      const Posts=await Post.find();
      
      res.render('home',{
          Posts,id
      });
      return
      
  }catch(err){
      console.log(err);
  }


 })


router.post('/',async (req,res)=>{
   console.log("hello again")
    const Username=req.body.username;
    const Password=req.body.password;
 
    if(Username && Password)
    {
       var user=await Form_data.findOne({username:Username})
       
       if(user!=null)
       {
          const ismatch= await bcrypt.compare(Password,user.password)
 
          if(ismatch==true)
          {
            
            console.log(user.id);
            var id=user.id.toString();

            return res.redirect(`/login/home/${id}`);
          }
          else{
             req.flash('message','Incorrect Password')
             return res.redirect('/login',{message:req.flash('message')});
          }
 
       }
       else{
          req.flash('message','User not found')
          return res.redirect('/login',{message:req.flash('message')});
 
 
       }
    }
    else{
       req.flash('message','Make sure each input field is filled');
       return res.redirect('/login',{message:req.flash('message')});
    }
 })



 module.exports=router;



