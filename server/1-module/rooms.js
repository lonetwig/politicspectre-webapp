const db=require('../4-util/db')

module.exports=class Rooms{
    static getFavRooms(){
        return db.execute(`SELECT *, (SELECT count(user_id) FROM user_in_room uir where uir.room_id=r.room_id) AS user_in_room, 
        (SELECT count(room_id) FROM favs f2 where f2.room_id=r.room_id) AS hearts 
        FROM favs f RIGHT JOIN rooms r USING(room_id) WHERE privacy='public' GROUP BY room_id ORDER BY user_in_room DESC LIMIT 60`)
    }

    static getNewestRooms(){
        return db.execute(`SELECT *, (SELECT count(user_id) FROM user_in_room uir where uir.room_id=r.room_id) AS user_in_room, 
        (SELECT count(room_id) FROM favs f where f.room_id=r.room_id) AS hearts
        FROM rooms r LEFT JOIN favs USING(room_id) 
        WHERE privacy='public' GROUP BY room_id ORDER BY room_id DESC LIMIT 60`)
    }

    static getRoomsId(){
        return db.execute(`SELECT room_id FROM rooms WHERE privacy='public'`)
    }

    static getRandomRooms(choices){
        return db.execute(`SELECT *, (SELECT count(user_id) FROM user_in_room uir where uir.room_id=r.room_id) AS user_in_room,
        (SELECT count(room_id) FROM favs f2 where f2.room_id=r.room_id) AS hearts
        FROM rooms r LEFT JOIN favs f USING (room_id) WHERE room_id IN (${choices}) GROUP BY room_id `)
    }
    
    static removeUser(user_id){
        return db.execute(`delete from user_in_room where user_id=${user_id}`)
    }

    static getAllId(){
        return db.execute(`select room_id from rooms limit 10`)
    }

    static getRoomInfo(room_id){
        return db.execute(`select room_name from rooms where room_id=${room_id}`)
    }
    
}