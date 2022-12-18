const db=require('../4-util/db')

module.exports=class Game{

//room----------------------------------------------------------------------

    static love(user_id,room_id){
        const date= Date.now()
        return db.execute('INSERT INTO favs(user_id,room_id,date) VALUES (?,?,?)',[user_id,room_id,date])
    }

    static unLove(user_id,room_id){
        return db.execute(`DELETE FROM favs WHERE user_id=${user_id} AND room_id=${room_id}`)
    }

    static checkRoom(room_id){
        return db.execute(`SELECT room_id from rooms WHERE room_id=${room_id}`)
    }

    static getRoomInfo(room_id){
        return db.execute(`SELECT *, (SELECT count(user_id) FROM user_in_room where room_id=${room_id}) AS user_in_room,max_size,
        (SELECT count(room_id) FROM favs where room_id=${room_id}) AS hearts FROM rooms WHERE room_id=${room_id}`)
    }

    static checkLove(user_id,room_id){
        return db.execute(`SELECT * FROM favs WHERE user_id=${user_id} AND room_id=${room_id}`)
    }

    static checkBans(user_id,room_id){
        return db.execute(`SELECT room_id from ban where user_id=${user_id} AND room_id=${room_id}`)
    }

//user----------------------------------------------------------------------

    static addUserInRoom(user_id,room_id){
        return db.execute(`INSERT INTO user_in_room(user_id,room_id) VALUES(?,?)`,[user_id,room_id])
    }

    static removeUserInRoom(user_id,room_id){
        if(room_id){
            return db.execute(`DELETE FROM user_in_room WHERE user_id=${user_id}`)
        }
        return db.execute(`DELETE FROM user_in_room WHERE user_id=${user_id}`)
    }

    static getAllUserInfo(user_id){
        return db.execute(`SELECT username,name,image,politic,bio,u.user_id
        ,(select count(f.user_id) from favs f WHERE f.user_id=u.user_id ) as hearts
        ,(select count(uir.user_id) from user_in_room uir WHERE uir.user_id=${user_id} ) as id 
        FROM users u where user_id=${user_id}`)
    }

    static checkUser(user_id,room_id){
        return db.execute(`select user_id from user_in_room where user_id=${user_id} and room_id=${room_id} `)
    }

//permission----------------------------------------------------------------------

    static checkPerms(room_id,user_id){
        return db.execute(`SELECT username,user_id,room_id,privacy,timer,permission,last_post_time,bio,image,politic,name,last_timer,
        (select count(room_id) from rooms r join favs f using(room_id) where r.owner=${user_id}) as hearts
        from rooms r join permission p using(room_id) join users using(user_id) WHERE room_id=${room_id} AND p.user_id=${user_id}`)
    }

    static checkAdmin(user_id,room_id){
        return db.execute(`SELECT * FROM rooms WHERE owner=${user_id} AND room_id=${room_id}`)
    }

    static checkPermissions(user_id,room_id){
        return db.execute(`SELECT * from permission where user_id=${user_id} and room_id=${room_id}`)
    }
    

    static createPermission(user_id,room_id,permission){
        return db.execute(`INSERT INTO permission(user_id,room_id,permission) VALUES(?,?,?)`,[user_id,room_id,permission])
    }

    static getAllPermissions(room_id){
        return db.execute(`SELECT u.user_id,uir.room_id,username,name,image,politic,bio,
        (select count(room_id) from rooms r join favs f using(room_id) where r.owner=u.user_id ) as hearts,
        (select permission from permission p where p.user_id=uir.user_id and p.room_id=uir.room_id) as permission
        FROM user_in_room uir
        JOIN users u on u.user_id=uir.user_id
        WHERE uir.room_id=${room_id} group by uir.user_id
        `)
    }

//chat----------------------------------------------------------------------

    static getChat(room_id){
        return db.execute(`SELECT u.user_id,p.permission,message_id,message,name,username,image,politic,bio,
        (select count(room_id) from rooms r join favs f using(room_id) where r.owner=u.user_id ) as hearts
        FROM chat c JOIN users u USING(user_id) 
        JOIN permission p ON p.user_id=u.user_id AND p.room_id=c.room_id
        WHERE c.room_id=${room_id} order by message_id desc limit 30`)
    }

    static getMoreChat(room_id,l1){
        return db.execute(`SELECT u.user_id,p.permission,message_id,message,name,image,politic,bio,
        (select count(room_id) from rooms r join favs f using(room_id) where r.owner=u.user_id ) as hearts
        FROM chat c JOIN users u USING(user_id) 
        JOIN permission p ON p.user_id=u.user_id AND p.room_id=c.room_id
        WHERE c.room_id=${room_id} order by message_id desc limit ${l1},30`)
    }

    static createMessage(user_id,room_id,message){
        return db.execute(`INSERT INTO chat(user_id,room_id,message) VALUES(?,?,?)`,[user_id,room_id,message])
    }

//assets--------------------------------------------------------------------

    static addAsset(room_id,user_id,type,content,top,right,bottom,left,fit){
        return db.execute(`INSERT INTO content(room_id,user_id,type,content,_top,_right,_bottom,_left,fit) VALUES(?,?,?,?,?,?,?,?,?)`,[room_id,user_id,type,content,top,right,bottom,left,fit])
    }

    static getAssets(room_id){
        return db.execute(`SELECT c.*,u.username,u.name,u.politic,u.image FROM content c JOIN users u USING(user_id) WHERE room_id=${room_id}`)
    }

    static setPostTime(user_id,time,timer){
        return db.execute(`UPDATE users SET last_post_time=${time},last_timer=${timer} WHERE user_id=${user_id}`)
    }

    static deleteAsset(content_id,room_id,content){
        return db.execute(`DELETE FROM content WHERE (content_id=${content_id} OR content='${content}' ) AND room_id=${room_id}`)
    }

    static countAssets(room_id){
        return db.execute(`SELECT count(content_id) as count FROM content where room_id=${room_id}`)
    }

//setting--------------------------------------------------------------------

    static updateRoom(maxSize,timer,privacy,room_id){
        return db.execute(`UPDATE rooms SET max_size=${maxSize},timer=${timer},privacy='${privacy}' WHERE room_id=${room_id}`)
    }

    static removeRoom(room_id){
        return db.execute(`delete from rooms where room_id=${room_id}`)
    }

    static getRoomContent(room_id){
        return db.execute(`select content from content where room_id=${room_id}`)
    }

    static getRoomImage(room_id){
        return db.execute(`select room_image from rooms where room_id=${room_id}`)
    }


//updateUser------------------------------------------------------------------

    static updateUser(user_id,room_id,val){
        return db.execute(`update permission set permission='${val}' where user_id=${user_id} and room_id=${room_id}`)
    }

    static banUser(user_id,room_id){
        return db.execute(`INSERT INTO ban(user_id,room_id) VALUES(?,?)`,[user_id,room_id])
    }

//ban------------------------------------------------------------------

    static getBans(room_id){
        return db.execute(`SELECT u.user_id,u.name,u.image,u.politic,u.username FROM ban b JOIN users u USING(user_id) WHERE b.room_id=${room_id}`)
    }

    static checkBan(user_id,room_id){
        return db.execute(`SELECT user_id FROM ban WHERE user_id=${user_id} and room_id=${room_id}`)
    }

    static deleteAllAssets(user_id,room_id){
        return db.execute(`DELETE FROM content WHERE user_id=${user_id} and room_id=${room_id}`)
    }

    static removeBan(user_id,room_id){
        return db.execute(`delete from ban where user_id=${user_id} and room_id=${room_id}`)
    }

    static selectAllContent(user_id,room_id){
        return db.execute(`select content from content where user_id=${user_id} and room_id=${room_id} and type='image'`)
    }

//search-----------------------------------------------------------

    static searchRooms(val){
        return db.execute(`select room_id,room_name,room_image,room_politic,(select count(user_id) from user_in_room uir where uir.room_id=r.room_id) as user_in_room
        from rooms r where room_name like '%${val}%' and privacy='public' order by user_in_room desc  limit 8 `)
    }

}