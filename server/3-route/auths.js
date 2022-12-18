const router=require('express').Router()
const {signUp,login}=require('../2-control/auths')
const{body}=require('express-validator')

//signup-------------------------------------------

router.post('/signup',[
    body('username').custom((value=>{
        const regEx=/^[a-zA-Z0-9 _\-]{1,15}$/
        if(!regEx.test(value)){
            throw new Error('Invalid username.')
        }
        return true
    })),
    body('email','Invalid email.').isEmail(),
    body('password').custom((value=>{
        const regEx=/^[a-zA-Z0-9]{6,40}$/
        if(!regEx.test(value)){
            throw new Error('Invalid password.')
        }
        return true
    }))
],signUp)

//login----------------------------------------------

router.post('/login',login)

module.exports=router