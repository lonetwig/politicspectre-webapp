const Profile=require('../1-module/profile')
const fs=require('fs')
const path=require('path')
const {validationResult}=require('express-validator')
const sharp=require('sharp')

function removeImg(img){
    if(img){
        fs.unlink(path.join(__dirname,'..','images',img),err=>null)
    }
}

async function resize(img,dlt){
    if(img){
        const p=path.join(__dirname,'..','images',img)
        return sharp(p)
        .resize(500,500)
        .toFile(path.join(__dirname,'..','images','ps'+img))
        .then(()=>{
            removeImg(dlt)
            removeImg(img)
        })
    }
}

exports.getInfo=(req,res,next)=>{
    let rooms
    let favs
    let user
    let user_id=res.locals.user.user_id
    Profile.getRooms(user_id)
    .then(([r])=>{
        rooms=r
        Profile.getFavs(user_id)
        .then(([f])=>{
            favs=f
            Profile.getUser(user_id)
            .then(([u])=>{
                user=u[0]
                res.json({rooms,favs,user})
            })
        })
    })
}

exports.createRoom=(req,res,next)=>{
    const img=req.file?req.file.filename:''
    const{name:name2,politic,privacy,timer}=req.body
    let name=name2[0].toUpperCase()+name2.slice(1)
    const error=validationResult(req)
    if(!error.isEmpty()){
        removeImg(img)
        return res.json({error:error.array()[0].msg})
    }
    console.log(timer==='true')
    Profile.create(name,img?'ps'+img:'',politic,privacy,res.locals.user.user_id,timer==='true'?60:0)
    .then(()=>{
        resize(img,img).then(()=>{
            return res.json({error:false})
        })
    })
}

exports.deleteRoom=(req,res,next)=>{
    Profile.deleteRoom(req.body.room_id)
    .then(()=>{
        removeImg(req.body.image)
        res.json({error:false})
    })
}

exports.deleteFav=(req,res,next)=>{
    Profile.deleteFav(req.body.room_id,res.locals.user.user_id)
    .then(()=>{
        res.json({error:false})
    })
}

exports.changeInfo=(req,res,next)=>{
    const img=req.file?req.file.filename:''
    const{username,politic,bio,oldImage}=req.body
    const oldImg=oldImage?oldImage.split('http://localhost:8000/')[1]:''
    const {user_id}=res.locals.user
    const error=validationResult(req)
    if(!error.isEmpty()){
        removeImg(img)
        return res.json({error:error.array()[0].msg})
    }
    const b=bio.split("'").join('')
    Profile.changeInfo(username,img?'ps'+img:oldImg,b,politic,user_id)
    .then(async ()=>{
        resize(img,img?oldImage.split('http://localhost:8000/')[1]:'')
        res.json({error:false})
    })
}