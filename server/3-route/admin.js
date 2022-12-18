const router=require('express').Router()
const{banUser,deleteRoom}=require('../2-control/admin')

router.post('/adminbanuser',banUser)
router.post('/admindltroom',deleteRoom)

module.exports=router
