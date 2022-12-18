import {useEffect, useState,useContext} from 'react'
import styles from '../../styles/profile/room.module.css'
import { RiDeleteBin5Line } from 'react-icons/ri';
import { FaHeart,FaHeartBroken } from 'react-icons/fa';
import {colors} from '../../styles/theme'
import Image from '../image'
import { UserContext } from '../context/userContext'
import Link from 'next/link';
const api=process.env.NEXT_PUBLIC_API
const imgLink=process.env.NEXT_PUBLIC_IMG

export default function Room({icon,name,image,politic,room_id,removeFav,user_id,owner,hearts,user_in_room,setConfirm}) {

    const [pol,setPolitic]=useState({red:false,blue:true,grey:false,green:false,purple:false})
    const {user}=useContext(UserContext)

      useEffect(()=>{
        setPolitic({red:false,blue:false,grey:false,green:false,purple:false,
            [politic]:true})
      },[])

//delete/unfav--------------------------------------------------

    function conf(e){
        setConfirm(e)
    }

    function deleteRoom(){
      if(user&&icon==='heart'){
          fetch(api+'deletefav',{
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+user
              },
            method:'POST',
            body:JSON.stringify({room_id,image})
        }).then(res=>res.json())
        .then(res=>{
          removeFav(room_id,user_id)
        })
      }
    }

  return (
    <>
    <div className={styles.full}>
        <div className={styles.image}>
            <div htmlFor='4' className={styles.imgInp}>
                <div className={styles.img}>
                    {/* <Image src='https://pbs.twimg.com/media/Fgt9MqUVUAAXAMi?format=png&name=900x900' width={80} height={80}/> */}
                    <Image politic={pol} info={{image:image?imgLink+image:''}} padding='10px'/>
                </div>
            </div>
        </div>

        <div className={styles.title}>
            <h1>{name}</h1>
            <h2>{owner}</h2>
        </div>

        <div className={styles.users}>
            <h1>Online</h1>
            <h2>{user_in_room}</h2>
        </div>

        <div className={styles.hrt}>
            <h1>Hearts</h1>
            <h2>{hearts}</h2>
        </div>

        <Link href={'/rooms/room?r='+room_id} className={styles.getRoom}>
            <div></div>
        </Link>

        <span className={styles.delete} onClick={()=>icon==='delete'?conf(room_id):deleteRoom()}>
            {icon==='delete'&&<RiDeleteBin5Line size={20} color={colors.red}/>}
            {icon==='heart'&&<FaHeartBroken size={20} color={colors.red}/>}
            <div className={styles.heart}>{icon==='heart'&&<FaHeart size={20} color={colors.red}/>}</div>
        </span>
        <span className={styles.deleteBig} onClick={()=>icon==='delete'?conf(room_id):deleteRoom()}>
            {icon==='delete'&&<RiDeleteBin5Line size={30} color={colors.red}/>}
            {icon==='heart'&&<FaHeartBroken size={30} color={colors.red}/>}
            <div className={styles.heart}>{icon==='heart'&&<FaHeart size={30} color={colors.red}/>}</div>
        </span>
    </div>

    </>
  )
}
