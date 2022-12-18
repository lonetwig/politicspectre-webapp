const express=require('express')
const app=express()
const authsRoute=require('./3-route/auths')
const profileRoute=require('./3-route/profile')
const roomsRoute=require('./3-route/rooms')
const gameRoute=require('./3-route/game')
const adminRoute=require('./3-route/admin')
const cors=require('cors')
const path=require('path')
const multer=require('multer')
require('dotenv').config()

app.use(express.json())
app.use(cors())

//multer--------------------------------------------------

app.use(require('express').static(path.join(__dirname,'images')))

const fileStorage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,path.join(__dirname,'images'))
    },
    filename:(req,file,cb)=>{
        cb(null,new Date().toISOString().slice(-4)+'-'+file.originalname)
    }
})

const upload=multer({storage:fileStorage,limits:{ fileSize:2100000}})
app.use(upload.single('image'),(req,res,next)=>{
    next()
})

//routes--------------------------------------------------

app.use('/api',authsRoute)
app.use('/api',profileRoute)
app.use('/api',roomsRoute)
app.use('/api',gameRoute)
app.use('/api',adminRoute)

//server--------------------------------------------------

const server=app.listen(8000)
const io=require('socket.io')(server)

io.on('connection',socket=>{
    socket.on('join_room',(room_id)=>{
        socket.join(room_id)
    })
    socket.on('add_msg',(user,msg,room_id)=>{
        if(msg){
            socket.to(room_id).emit('res_msg',user,msg)
        }
    })
    socket.on('add_asset',(asset,room_id)=>{
        if(asset){
            socket.to(room_id).emit('res_add_asset',asset)
        }
    })
    socket.on('erase_asset',(id,room_id)=>{
        if(id){
            socket.to(room_id).emit('res_erase_asset',id)
        }
    })
    socket.on('kick',(id,room_id)=>{
        socket.to(room_id).emit('res_kick',id)
    })
    socket.on('ban',(id,room_id)=>{
        socket.to(room_id).emit('res_ban',id)
    })
    socket.on('leave_room',(room_id)=>{
        if(room_id){
            socket.leave(room_id)
        }
    })
    socket.on('remove_user',(room_id,id)=>{
            console.log(id)
            socket.to(room_id).emit('res_remove_user',id)
    })
})