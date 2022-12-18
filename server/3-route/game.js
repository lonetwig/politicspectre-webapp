const router=require('express').Router()
const {loveRoom,unLoveRoom,getInfo,checkLove,addUserToRoom,
    removeUserFromRoom,getChat,checkRoom,createMessage,
    getAllPermissions,addAsset,getAssets,deleteAsset,checkPerms,
    updateRoom,updateUser,getBans,banUser,removeBan,removeRoom,
    searchRooms,getMoreChat
}=require('../2-control/game')
const {checkJwt,passJwt}=require('../4-util/checkJwt')

//love---------------------------------------------------

router.post('/loveroom',checkJwt,loveRoom)
router.post('/unloveroom',checkJwt,unLoveRoom)

//room-info--------------------------------------------------

router.post('/getroominfo',checkRoom,passJwt,getInfo)
router.post('/checklove',checkJwt,checkLove)

//userinroom--------------------------------------------

router.post('/addusertoroom',checkRoom,checkJwt,addUserToRoom)
router.post('/removeuserfromroom',checkRoom,checkJwt,removeUserFromRoom)

//chat--------------------------------------------

router.post('/getchat',getChat)
router.post('/createmessage',checkJwt,createMessage)
router.post('/moremessages',getMoreChat)

//permission----------------------------------------

router.post('/getadmins',checkRoom,passJwt,checkPerms,getAllPermissions)

//assets------------------------------------------

router.post('/addasset',checkJwt,checkPerms,addAsset)
router.post('/getassets',getAssets)
router.post('/deleteasset',checkJwt,checkPerms,deleteAsset)

//setting-----------------------------------------

router.post('/updateroom',checkJwt,checkPerms,updateRoom)
router.post('/removeroom',checkJwt,checkPerms,removeRoom)

//updateUser--------------------------------------

router.post('/updateuser',checkJwt,checkPerms,updateUser)

//Bans--------------------------------------

router.post('/getbans',passJwt,checkPerms,getBans)
router.post('/banuser',checkJwt,checkPerms,banUser)
router.post('/removeban',checkJwt,checkPerms,removeBan)

//search----------------------------------------

router.post('/search',searchRooms)

module.exports=router