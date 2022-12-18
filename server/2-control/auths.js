const User=require('../1-module/auths')
const bcrypt=require('bcrypt')
const {validationResult, check}=require('express-validator')
const fs=require('fs')
const path=require('path')
const jwt=require('jsonwebtoken')
const sharp=require('sharp')
require('dotenv').config()

function removeImg(img){
    if(img){
        fs.unlink(path.join(__dirname,'..','images',img),err=>'')
    }
}

async function resize(img){
    if(img){
        const p=path.join(__dirname,'..','images',img)
        await sharp(p)
        .resize(500,500)
        .toFile(path.join(__dirname,'..','images','ps'+img))
        removeImg(img)
    }
}

//signup---------------------------------------------------------

exports.signUp=(req,res,next)=>{
    const{username,email,password,politic,ratio}=req.body
    const user=new User(username,email,password,politic)
    const error=validationResult(req)
    const img=req.file?req.file.filename:''
    if(!error.isEmpty()){
        removeImg(img)
        return res.json({error:error.array()[0].msg})
    }
    User.getUserByUsername(username)
    .then(([data])=>{
        if(data[0]){
            removeImg(img)
            return res.json({error:'Username already exist.'})
        }
        User.getUserByEmail(email)
        .then(([data])=>{
            if(data[0]){
                removeImg(img)
                return res.json({error:'Email already exist.'})
            }
            user.save(img?'ps'+img:'').then(()=>{
                User.getUser(username).then(([data])=>{
                    resize(img,ratio)
                    log(data[0],res,[])
                })
            })
        })
    })
}

//login---------------------------------------------------------

exports.login=(req,res,next)=>{
    const {user,password}=req.body
    let room
    User.getUser(user).then(([data])=>{
        if(!data[0]){
            return res.json({error:"User doesn't exist."})
        }
        return bcrypt.compare(password,data[0].password)
        .then(result=>{
            if(result){
                log(data[0],res)
            }else{
                res.json({error:"Invalid Password."})
            }
        })
    })
}

function log(user,res){
    const token=jwt.sign({
        user_id:user.user_id,
        username:user.username
        },process.env.DB_JWT,{}
    )
     res.json({error:false,
        token:token,
        user_id:user.user_id,
        username:user.username})
}