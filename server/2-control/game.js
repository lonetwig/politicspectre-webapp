const Game=require('../1-module/game')
const path=require('path')
const fs=require('fs')
const sharp=require('sharp')

function removeImg(img){
    if(img){
        fs.unlink(path.join(__dirname,'..','images',img),err=>'')
    }
}
 
async function resize(img){
    if(img){
        const p=path.join(__dirname,'..','images',img)
        sharp(p)
        .resize(500)
        .toFile(path.join(__dirname,'..','images','ps'+img))
        .then(()=>{removeImg(img)})
        
    }
}

//roomInfo-----------------------------------------------------------

exports.loveRoom=(req,res,next)=>{
    Game.love(res.locals.user.user_id,req.body.room_id).then(()=>res.json({loved:true}))
}

exports.unLoveRoom=(req,res,next)=>{
    Game.unLove(res.locals.user.user_id,req.body.room_id).then(()=>res.json({loved:false}))
}

exports.getInfo=(req,res,next)=>{
    const {room_id}=req.body
    const user_id=res.locals.user?res.locals.user.user_id:false
    Game.getRoomInfo(room_id).then(([info])=>{
        if(info[0]){
            if(info[0].privacy==='private'){
                if(user_id!==info[0].owner){
                    return res.json({error:'Private Room'})
                }
            }
            if(!user_id){
                return res.json({roomInfo:info[0]})
            }
            Game.checkBans(user_id,room_id).then(([data])=>{
                if(data[0]){
                    return res.json({error:'You are banned from this room'})
                }
                return res.json({roomInfo:info[0]})
            })
        }else{
            res.json({error:'Room not found'})
        }
    })
}

exports.checkLove=(req,res,next)=>{
    const {user_id}=res.locals.user
    const {room_id}=req.body
    Game.checkLove(user_id,room_id).then(([love])=>{
        const loved=love[0]?true:false
        res.json({loved})
    })
}

//user-------------------------------------

exports.addUserToRoom=(req,res,next)=>{
    const user=res.locals.user
    const {room_id}=req.body
    // Game.checkRoom(room_id).then(([data])=>{
    //     if(!data[0])return res.json({error:'room not found'})
    // })
    checkUser(res,user,room_id)
}

exports.removeUserFromRoom=(req,res,next)=>{
    const user=res.locals.user
    Game.removeUserInRoom(user.user_id).then(x=>{
        return res.json({error:false})
    })
}

function checkUser(res,user,room_id){
    Game.checkUser(user.user_id,room_id).then(([data])=>{
        if(!data[0]){
            return addUser(res,user,room_id,room_id)
        }
        return res.json({error:false})
    })
}

function addUser(res,user,room,room_id){
    Game.checkBan(user.user_id,room_id).then(([data])=>{
        if(data[0]){
            return res.json({error:false})
        }
        Game.addUserInRoom(user.user_id,room_id).then(x=>{
            res.json({error:false})
        })
    })
}


//chat---------------------------------------------

exports.getChat=(req,res,next)=>{
    const {room_id}=req.body
    Game.getChat(room_id).then(([data])=>{
        res.json({chat:data})
    })
}

exports.createMessage=(req,res,next)=>{
    const {user_id}=res.locals.user
    const {room_id,message}=req.body
    if(message&&message.length<499){
        Game.createMessage(user_id,room_id,message).then(()=>res.json({error:false}))
    }else{
        res.json({error:'Invalid message'})
    }
}

exports.getMoreChat=(req,res,next)=>{
    const{room_id,length}=req.body
    Game.getMoreChat(room_id,length).then(([data])=>{
        res.json({chat:data,more:data.length<30?false:true})
    })
}

//admins-----------------------------------------------

exports.getAllPermissions=(req,res,next)=>{
    const {room_id}=req.body
    Game.getAllPermissions(room_id).then(([data])=>{
        return res.json({error:false,admins:data,me:res.locals.perm})
     })
}

//assets------------------------------------------------

exports.addAsset=(req,res,next)=>{
    const {room_id,asset,image,post_time,fit}=req.body
    const {user_id}=res.locals.user
    const {permission,timer,last_post_time:lpt,last_timer:lt}=res.locals.perm

    const {type,_top,_right,_bottom,_left}=JSON.parse(asset)
    const img=req.file?req.file.filename:''
    const check=img?'ps'+img:image
    const checkT=lt<timer?lt:timer
    Game.countAssets(room_id).then(([data])=>{
        if(data[0].count>200){
            return res.json({error:'You have reached max assets'})
        }
        if(check.length>999){
            return res.json({error:'Invalid asset'})
        }
        if(timer!==0&&post_time<lpt+checkT){
            return res.json({error:"You can't post now."})
        }
        if(permission==='watcher'){
            return res.json({error:"You can't post as watcher."})
        }
        Game.addAsset(room_id,user_id,type,check,_top,_right,_bottom,_left,fit).then(()=>{
            if(req.file){resize(img)}
            const date=timer!==0?parseInt(Date.now()/1000):lpt
            if(date===lpt){
                return res.json({error:false,timer,sendImg:check})
            }
            Game.setPostTime(user_id,date,timer).then(()=>{
                res.json({error:false,timer,sendImg:check})
            })
        })
    })

}

exports.getAssets=(req,res,next)=>{
    const{room_id}=req.body
    Game.getAssets(room_id).then(([data])=>{
        res.json({assets:data})
    })
}

exports.deleteAsset=(req,res,next)=>{
    const {room_id,id,content}=req.body
    const{perm}=res.locals
    if(perm.permission==='admin'){
        Game.deleteAsset(id,room_id,content).then(()=>{
            removeImg(content)
            res.json({error:false})
        })
    }else{
        res.json({error:"You are not admin."})
    }
}

//check----------------------------------------

exports.checkRoom=(req,res,next)=>{
    const{room_id}=req.body
    if(!room_id)return res.json({error:'Room does not exist'})
    Game.checkRoom(room_id).then(([data])=>{
        if(!data[0]){
            return res.json({error:'Room does not exist'})
        }
        next()
    })
}

function createPerm(res,user_id,room_id,admin,next){
    Game.createPermission(user_id,room_id,admin).then(()=>{
        Game.checkPerms(room_id,user_id).then(([data])=>{
            res.locals.perm=data[0]
            next()
        })
    })
}

exports.checkPerms=(req,res,next)=>{
    const user_id=res.locals.user?res.locals.user.user_id:false
    const{room_id}=req.body
    if(!room_id)res.json({error:'no room id'})
    if(user_id){
        Game.checkPerms(room_id,user_id).then(([data])=>{
            if(data[0]){
                res.locals.perm=data[0]
                return next()
            }
            Game.checkAdmin(user_id,room_id).then(([u])=>{
                createPerm(res,user_id,room_id,u[0]?'admin':'watcher',next)
            })
        })
    }else{
        next()
    }
}

//setting----------------------------------------

exports.updateRoom=(req,res,next)=>{
    const {maxSquares,timer,privacy,room_id}=req.body
    const {perm}=res.locals
    if(perm.permission!=='admin'){
        return res.json({error:'You are not admin'})
    }
    Game.updateRoom(maxSquares,timer,privacy,room_id)
    .then(()=>{
        res.json({error:false})
    })
}

exports.removeRoom=(req,res,next)=>{
    const {room_id}=req.body
    const {perm}=res.locals
    if(perm.permission!=='admin'){
        return res.json({error:'You are not admin'})
    }
    let toDelete=[]
    Game.getRoomImage(room_id).then(([data])=>{
        if(data[0]){
            toDelete=[{content:data[0].room_image}]
        }
        Game.getRoomContent(room_id).then(([data])=>{
            if(data[0]){
                toDelete=[...toDelete,...data]
            }
            Game.removeRoom(room_id).then(()=>{
                toDelete.forEach(ass=>removeImg(ass.content))
                res.json({error:false})
            })
        })
    })
}

//user Update------------------------------------

exports.updateUser=(req,res,next)=>{
    const{room_id,user_id,val}=req.body
    const{permission}=res.locals.perm
    if(permission!=='admin'){
        return res.json({error:'You are not admin'})
    }
    if(val==='ban'){
        return ban(res,user_id,room_id)
    }
    if(permission==='admin'){
        Game.checkAdmin(user_id,room_id).then(([data])=>{
            if(data[0]){
                return res.json({error:`You can't edit owner of the room`})
            }
            if(val==='watcher'||val==='stage'||val==='admin'){
                Game.updateUser(user_id,room_id,val).then(()=>{
                    return res.json({error:false})
                })
            }
        })

    }
}

//bans-----------------------------------------------------

exports.getBans=(req,res,next)=>{
    const{room_id}=req.body
    const {permission}=res.locals.perm
    if(permission==='admin'){
        return Game.getBans(room_id).then(([data])=>{
            res.json({bans:data})
        })
    }
    res.json({bans:[]})
}

exports.checkBan=(req,res,next)=>{
    const user_id=res.locals.user?res.locals.user.user_id:false
    const{room_id}=req.body
    if(user_id&&room_id){
        return Game.checkBan(user_id,room_id).then(([data])=>{
            if(!data[0]){
                return res.json({error:"You're banned from this room"})
            }
            return next()
        })
    }
    next()
}

exports.banUser=(req,res,next)=>{
    const{room_id,user_id}=req.body
    const{permission}=res.locals.perm
    if(permission!=='admin'){
        return res.json({error:'You are not admin'})
    }
    ban(res,user_id,room_id)
}

exports.removeBan=(req,res,next)=>{
    const{room_id,user_id}=req.body
    const{permission}=res.locals.perm
    if(permission!=='admin'){
        return res.json({error:'You are not admin'})
    }
    Game.removeBan(user_id,room_id).then(()=>{
        res.json({error:false})
    })
}

function ban(res,user_id,room_id){
    Game.checkBan(user_id,room_id).then(([data])=>{
        if(data[0]){
            return res.json({error:'User already banned'})
        }
        Game.checkAdmin(user_id,room_id).then(([data])=>{
            if(data[0]){
                return res.json({error:`You can't ban the owner of the room.`}) 
            }
            Game.banUser(user_id,room_id).then(()=>{
                Game.selectAllContent(user_id,room_id).then(([data])=>{
                    if(data[0]){
                        data.forEach(ass=>removeImg(ass.content))
                    }
                    Game.deleteAllAssets(user_id,room_id).then(()=>{
                        return res.json({error:false})
                    })
                })
            })
        })
    })
}

//search------------------------------------------------

exports.searchRooms=(req,res,next)=>{
    const{val}=req.body
    if(!val)return res.json([])
    Game.searchRooms(val).then(([data])=>{res.json(data)})
}