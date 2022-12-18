const db=require('../4-util/db')

module.exports=class Admin{

    static getUserRooms(user_id){
        return db.execute(`select room_id from rooms where owner=${user_id}`)
    }

    static getUserContent(user_id){
        return db.execute(`select content from content where user_id=${user_id} and type='image'`)
    }

    static getUserId(room_id){
        return db.execute(`select owner from rooms where room_id=${room_id}`)
    }

    static getUserIdByName(username){
        return db.execute(`select user_id from users where username='${username}'`)
    }

    static getUserImg(username){
        return db.execute(`select image from users where username='${username}'`)
    }

    static getRoomImg(user_id){
        return db.execute(`select room_image from rooms where owner=${user_id}`)
    }

    static getAllImage(val){
        return db.execute(`select content from content where type='image' and user_id=${val}`)
    }

    static banUser(username){
        return db.execute(`delete from users where username='${username}'`)
    }

    static deleteRoom(room_id){
        return db.execute(`delete from rooms where room_id=${room_id}`)
    }
}