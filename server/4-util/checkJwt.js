const jwt=require('jsonwebtoken')
require('dotenv').config()

exports.checkJwt=(req,res,next)=>{
    const fullToken=req.header('Authorization')
    if(fullToken){
        const token=fullToken.split(' ')[1]
        const user=jwt.verify(token,process.env.DB_JWT)
        res.locals.user=user
        return next()
    }
    return res.json({error:'not logged'})
}

exports.passJwt=(req,res,next)=>{
    const fullToken=req.header('Authorization')
    if(fullToken!=='Bearer notLogged'){
        const token=fullToken.split(' ')[1]
        const user=jwt.verify(token,process.env.DB_JWT)
        res.locals.user=user
    }
    return next()
}