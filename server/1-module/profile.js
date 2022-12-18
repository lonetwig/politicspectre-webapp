const db=require('../4-util/db')

module.exports=class Profile{
    
    static create(name,image,politic,privacy,owner,timer){
        return db.execute('INSERT INTO rooms(room_name,room_image,room_politic,privacy,owner,timer) VALUES (?,?,?,?,?,?)',[name,image,politic,privacy,owner,timer])
    }
 
    static getRooms(owner){
        return db.execute(`SELECT r.room_id,u.user_id, u.name AS owner, r.room_name, r.room_politic, r.room_image,
        (SELECT count(user_id) FROM user_in_room uir where uir.room_id=r.room_id) AS user_in_room,
        (SELECT count(user_id) FROM favs f where f.room_id=r.room_id) as hearts
        FROM rooms r right JOIN users u ON r.owner=u.user_id WHERE r.owner=${owner} GROUP BY room_id order by room_id desc`)
    }

    static getFavs(user_id){
        return db.execute(`SELECT f.user_id,f.room_id, u.name AS owner, r.room_name, r.room_politic, r.room_image,
        (SELECT count(user_id) FROM user_in_room uir where uir.room_id=r.room_id) as user_in_room,
        (SELECT count(user_id) FROM favs f2 where f2.room_id=r.room_id) as hearts
        FROM favs f left JOIN rooms r USING(room_id) JOIN users u ON u.user_id=r.owner
        where f.room_id in(select room_id from favs where user_id=${user_id}) group by room_id order by date desc`)
    }

    static getUser(user_id){
        return db.execute(`SELECT *,(SELECT count(user_id) FROM favs f join rooms r using(room_id) where r.owner=u.user_id) as hearts 
        FROM users u WHERE user_id=${user_id}`)
    }

    static deleteRoom(room_id){
        return db.execute(`DELETE FROM rooms WHERE room_id=${room_id}`)
    }

    static deleteFav(room_id,user_id){
        return db.execute(`DELETE FROM favs WHERE room_id=${room_id} AND user_id=${user_id}`)
    }

    static changeInfo(username,image,bio,politic,user_id){
        return db.execute(`UPDATE users SET name='${username}', image='${image}', politic='${politic}', bio='${bio}' WHERE user_id=${user_id}`)
    }
}