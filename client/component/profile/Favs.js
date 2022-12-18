import {useState,useEffect} from 'react'
import styles from '../../styles/profile/favs.module.css'
import Room from './Room'

export default function Account({info,setInfo}) {
  

  function removeFav(roomId,userId){
    const newRender=info.favs.filter(r=>{
      if(r.room_id===roomId&&r.user_id===userId){
        return false
      }
      return true
    })
    setInfo({...info,favs:newRender})
  }

  const renderFavs=info.favs.map(fav=>(
    <Room key={fav.room_id} room_id={fav.room_id} 
    name={fav.room_name} image={fav.room_image}
    politic={fav.room_politic} icon='heart'
    removeFav={removeFav} user_id={fav.user_id}
    owner={fav.owner} hearts={fav.hearts}
    user_in_room={fav.user_in_room}/>
  ))

  return (
    <div className={styles.full}>
      <div className={styles.rooms}>
        {renderFavs}
      </div>
    </div>
  )
}
