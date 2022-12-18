import Link from 'next/link'
import React, { useEffect,useState } from 'react'
import styles from '../styles/search.module.css'

export default function Search({global}){
    const{searching,setSearching,val,setVal}=global
    const[result,setResult]=useState([])
    const api=process.env.NEXT_PUBLIC_API
    const imgLink=process.env.NEXT_PUBLIC_IMG

    useEffect(()=>{
        if(!searching)return
        const formData=new FormData()
        formData.append('val',val)
        fetch(api+'search',{
            method:'POST',
            body:formData
        })
        .then((res)=>res.json())
        .then((res)=>setResult(res))
    },[val])
    
    const render=result.map(s=>(
        <div key={s.room_id} className={styles.result} >
            <div className={styles.profileImg} style={{background:`var(--${s.room_politic})`}}>
                {s.room_image&&<img src={imgLink+s.room_image}/>}
            </div>
            <h3 style={{color:`var(--${s.room_politic})`}}>{s.room_name}</h3>
            <a  className={styles.mask} href={'/rooms/room?r='+s.room_id}></a>
        </div>
    ))


  return (
    <div className={styles.full}>
        {render}
    </div>
  )
}
