import React, { useContext, useEffect, useState } from 'react'
import styles from '../../styles/profile/rooms.module.css'
import Room from './Room'
import Link from 'next/link'
import { UserContext } from '../context/userContext'

export default function Rooms({info,setInfo,loading}) {
  const [confirm,setConfirm]=useState(false)
  const {user}=useContext(UserContext)
  const api=process.env.NEXT_PUBLIC_API

  function removeRoom(id){
    const newRender=info.rooms.filter(r=>r.room_id!==id)
    setInfo({...info,rooms:newRender})
  }

  const renderRooms=info.rooms.map(room=>(
    <Room key={room.room_id} icon='delete' 
    room_id={room.room_id} name={room.room_name} 
    image={room.room_image} politic={room.room_politic}
    removeRoom={removeRoom} owner={room.owner}
    hearts={room.hearts} user_in_room={room.user_in_room}
    setConfirm={setConfirm}/>
  ))

  //delete room----------------------------------------------

  function deleteRoom(){
    const formData=new FormData()
    formData.append('room_id',confirm)
    fetch(api+'removeroom',{
      method:'POST',
      headers:{
        Authorization:'Bearer '+user
      },
      body:formData
    }).then(res=>res.json())
    .then((res)=>{
      removeRoom(confirm)
      conf(false)
    })
  }

  function conf(e){
    setConfirm(e)
}

  return (
    <>
      <div className={styles.full}>
        <div className={styles.rooms}>
          {renderRooms}
        </div>
        <div className={styles.add}>
            <Link href='/profile/create'><h1>Add New Room</h1></Link>
        </div>
      </div>

      {confirm&&<div className={styles.fullConfirm}>
        <div onClick={()=>conf(false)} className={styles.mask}></div>
        <div className={styles.confirm}>
          <div>Are you sure you want to delete this room? All the assets and informations will be deleted permanently.</div>
          <button onClick={deleteRoom}>Confirm</button>
          <button className={styles.return} onClick={()=>conf(false)}>Return</button>
        </div>
      </div>}
    </>


  )
}
