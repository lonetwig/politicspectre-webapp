const router=require('express').Router()
const {getInfo,createRoom, deleteRoom, deleteFav,changeInfo}=require('../2-control/profile')
const {checkJwt,passJwt}=require('../4-util/checkJwt')
const {body} =require('express-validator')

router.get('/profile',checkJwt,getInfo)

//create---------------------------------------------------

router.post('/create',checkJwt,[
    body('name').custom((value=>{
        const regEx=/^.{1,40}$/
        if(!regEx.test(value)){
            throw new Error('Invalid name.')
        }
        return true
    }))
],createRoom)

//create---------------------------------------------------

router.post('/changeinfo',checkJwt,[
    body('username').custom((value=>{
        const regEx=/^[a-zA-Z0-9 _\-]{1,15}$/
        if(!regEx.test(value)){
            throw new Error('Invalid name.')
        }
        return true
    })),
    body('bio').custom((value=>{
        const regEx=/^.{1,100}$/
        if(!regEx.test(value)){
            throw new Error('Invalid bio.')
        }
        return true
    }))
],changeInfo)

//delete---------------------------------------------------

router.post('/deleteroom',checkJwt,deleteRoom)
router.post('/deletefav',checkJwt,deleteFav)

module.exports=router