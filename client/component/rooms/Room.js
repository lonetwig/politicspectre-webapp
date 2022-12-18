import React from 'react'
import styles from '../../styles/rooms/room.module.css'
import { AiFillHeart } from 'react-icons/ai';
import { HiUser } from 'react-icons/hi';
import Image from '../image'
import Link from 'next/link';

export default function Room({name,img,user_in_room,heart,color,room_id}){

  return (
    <div className={styles.full}>
        <div className={styles.image}>
          <Image politic={{[color]:true}} info={{image:img}} padding='50px'/>
        </div>
        <div className={styles.info}>
            <div>
                <h1>{name}</h1>
            </div>
            <div>
                <div><HiUser/><h2>{user_in_room}</h2></div>
                <div><AiFillHeart/><h2>{heart}</h2></div>
            </div>
        </div>
        <Link href={'/rooms/room?r='+room_id} className={styles.getRoom}>
        </Link>
    </div>
  )
}
