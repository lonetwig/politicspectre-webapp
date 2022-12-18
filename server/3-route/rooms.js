const router=require('express').Router()
const {getRooms,removeUserFromRooms,getRoomInfo,getAllId}=require('../2-control/rooms')
const {checkJwt,passJwt}=require('../4-util/checkJwt')

router.get('/getrooms',getRooms)
router.post('/removeuser',passJwt,removeUserFromRooms)
router.get('/getallid',getAllId)
router.post('/getroomname',getRoomInfo)

module.exports=router