require('dotenv').config()
const Admin=require('../1-module/admin')
const fs=require('fs')
const path=require('path')

function removeImg(img){
    if(img){
        fs.unlink(path.join(__dirname,'..','images',img),err=>'')
    }
}
 

exports.banUser=(req,res,next)=>{
    const{name,password,user}=req.body
    if(name===process.env.DB_NAME&&password===process.env.DB_PASSWORD2){
        Admin.getUserIdByName(user).then(([data])=>{
            const user_id=data[0].user_id
            Admin.getUserImg(user).then(([data])=>{
                removeImg(data[0].image)
            })
            Admin.getUserRooms(user_id).then(([data])=>{
                data.forEach(e=>{
                    dltRoom(name,password,e.room_id)
                })
            }).then(()=>{
                Admin.getUserContent(user_id).then(([data])=>{
                    data.forEach(e=>removeImg(e.content))
                })
                Admin.banUser(user)
            })
        })
    }
}

exports.deleteRoom=(req,res,next)=>{
    const{name,password,room}=req.body
    dltRoom(name,password,room)
}

function dltRoom(name,password,room){
    if(name===process.env.DB_NAME&&password===process.env.DB_PASSWORD2){
        Admin.getUserId(room).then(([data])=>{
            if(data[0]){
                const user_id=data[0].owner
                Admin.getAllImage(user_id).then(([data])=>{
                    Admin.deleteRoom(room)
                    Admin.getRoomImg(user_id).then(([data])=>{
                        removeImg(data[0].room_image)
                    })
                    data.forEach(e => {
                        removeImg(e.content)
                    })
                })
            }
        })
    }
}