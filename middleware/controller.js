const Form_data = require("../DB/schema");
const nodemailer = require('nodemailer');
const bcrypt=require('bcrypt');
const randomstring = require('randomstring');
const config = require('../config/config')

const forget_password = async (req, res) => {
    try {
        const Email=req.body.email;
        const user = await Form_data.findOne({ email:Email });

        if (user) {
            const randomString = randomstring.generate();
            const data = await Form_data.updateOne({ email: Email }, { $set: { token: randomString } })
            sendResetPassword(user.username, user.email, randomString);
            res.send({
                success: true,
                message: 'Plase check you MAIL'
            })

        } else {
            console.log("this email does not exist");
        }
    } catch (err) {
        console.log("something wrong", err);
    }
}

const sendResetPassword = async (username, email, token) => {
    try {
        console.log(config);
        const transporter = nodemailer.createTransport({
            // host: 'smtp.ethereal.email',
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: config.emailUser,
                pass: config.emailPassword
            }
        });
        // console.log(transporter);
        // let info = await transporter.sendMail({
            //     from: config.emailUser, // sender address
            //     to: email, // list of receivers
            //     subject: "Reset Password", // Subject line
        //     text: "Greetings,", // plain text body
        //     html: '<p> Hi '+ username +' <a href="http://127.0.0.1:4000/forgetpassword" >Reset your account Password Here.</a> Thank You </p>', // html body
        // });
        let info = {
            from: config.emailUser, // sender address
            to: email, // list of receivers
            subject: "Reset Password", // Subject line
            text: "Greetings,", // plain text body
            html: '<p> Hi '+ username +' <a href="http://127.0.0.1:4000/resetpassword?token='+token+'">Reset your account Password Here.</a> Thank You </p>', 
        };
        console.log(info);
        transporter.sendMail(info, (err, information) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log("Mail has been send:-", information.response);
            }

        })
    }catch(err){
        console.log("mail not sended",err);
    }
}

const reset_password=async (req,res)=>{

    try{
        const token=req.query.token;
        const tokenData=await Form_data.findOne({token:token});
        console.log(tokenData)
        if(tokenData)
        {
            const Password=req.body.password;
            const newPassword= await bcrypt.hash(Password,10);
            console.log(newPassword);
            const  updatedData= await Form_data.findOneAndUpdate({token:token},{$set:{password:newPassword}},{new:true})
            res.send({
                message:"Pasword Reset Successfully",
                value:updatedData
            })
        }else{
            console.log('Something Went Wrong')
        }
    }catch(err){
        console.log(err);
    }

}
// const authenticate=async(req,res,next)=>{
//         console.log("hello again")
//         const Username=req.body.username;
//         const Password=req.body.password;
        
//         if(Username && Password)
//         {
//        var user=await Form_data.findOne({username:Username})
       
//        if(user!=null)
//        {
//           const ismatch= await bcrypt.compare(Password,user.password)
 
//           if(ismatch==true)
//           {
//              // req.session.user=user;
//              // return res.send({
//              //    message:'Successfully LOGGED IN.....',
//              //    value:user
//              // })
//             // res.render('home');
//             console.log(req.body._id)
//             return res.redirect('/login/home') 
          
//           }
//           else{
//              req.flash('message','Incorrect Password')
//              return res.redirect('/login',{message:req.flash('message')});
//           }
 
//        }
//        else{
//           req.flash('message','User not found')
//           return res.redirect('/login',{message:req.flash('message')});
 
 
//        }
//     }
//     else{
//         req.flash('message','Make sure each input field is filled');
//         return res.redirect('/login',{message:req.flash('message')});
//     }
// }

module.exports={
    forget_password,
    sendResetPassword,
    reset_password
    // ,authenticate
}