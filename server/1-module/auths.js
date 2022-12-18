const db=require('../4-util/db')
const bcrypt=require('bcrypt')

module.exports=class User{
    constructor(username,email,password,politic){
        this.username=username
        this.name=username
        this.email=email
        this.password=password
        this.image=''
        this.politic=politic
    }

    async save(img){
        const password=await bcrypt.hash(this.password,12)
        return db.execute(`INSERT INTO politicspectre.users(username,name,email,password,image,politic) VALUE(?,?,?,?,?,?)`,[this.username,this.name,this.email,password,img,this.politic])
    }

    static getUserByUsername(username){
        return db.execute(`SELECT * FROM politicspectre.users WHERE username='${username}'`)
    }

    static getUserByEmail(email){
        return db.execute(`SELECT * FROM politicspectre.users WHERE email='${email}'`)
    }

    static getUser(val){
        return db.execute(`SELECT username,password,user_id FROM politicspectre.users WHERE email='${val}' OR username='${val}'`)
    }

}