const Rooms=require('../1-module/rooms')

exports.getRooms=(req,res,next)=>{
    let popular=[]
    let random=[]
    let newest =[]
    nor=60

    let idArray=[]
    Rooms.getRoomsId().then(([data])=>{
        if(data[0]){
            const lgt=data.length<nor?data.length:nor
            let newData=data
            for(let i=0;i<lgt;i++){
                let id=(newData[Math.floor(Math.random()*newData.length)])
                idArray=[...idArray,id.room_id]
                newData=newData.filter(x=>x.room_id!=id.room_id)
            }
            let choices=''
            idArray.forEach(id=>choices=id===idArray[idArray.length-1]?choices+id:choices+id+',')
            
            Rooms.getRandomRooms(choices).then(([r])=>{
                let count=[]
                for(let i=0;count.length<r.length;i){
                    let n=Math.floor(Math.random()*r.length)
                    if(!count.some(x=>x===n)){
                        count.push(n)
                    }
                }
                count.forEach(c=>random.push(r[c]))
                Rooms.getFavRooms().then(([f])=>{
                    popular=f
                    Rooms.getNewestRooms().then(([n])=>{
                        newest=n
                        return res.json({newest,popular,random})
                    })
                })
            })
        }else{
            res.json({newest:[],popular:[],random:[]})
        }
    })
    
}

exports.removeUserFromRooms=(req,res,next)=>{
    const user_id=res.locals.user?res.locals.user.user_id:false
    if(!user_id){
        return res.json({error:'not logged'})
    }
    Rooms.removeUser(user_id).then(()=>{
        return res.json({error:false})
    })
}

exports.getAllId=(req,res,next)=>{
    Rooms.getAllId().then(([data])=>{
        res.json({id:data})
    })
}

exports.getRoomInfo=(req,res,next)=>{
    Rooms.getRoomInfo(req.body.room_id).then(([data])=>res.json({info:data}))
}