import React from 'react'
import styles from '../../styles/game/banList.module.css'

export default function BanList({global}){
    const{info,setInfo,setMode,setBanList,room_id,setGridError,user}=global
    const api=process.env.NEXT_PUBLIC_API
    const imgLink=process.env.NEXT_PUBLIC_IMG

    function cancel(){
        setBanList(false)
        setMode('select')
    }

//remove ban--------------------------------------------------

function removeBan(e){
    const formData=new FormData()
    formData.append('room_id',room_id)
    formData.append('user_id',e)
    fetch(api+'removeban',{
        method:'POST',
        headers:{
            Authorization:'Bearer '+user
        },body:formData
        }).then(res=>res.json())
        .then(res=>{
        if(res.error){
            setGridError(res.error)
            setBanList(false)
            setMode('select')
        }
        const newList=info.bans.filter(a=>a.user_id!==e)
        setInfo(pre=>({...pre,bans:newList}))
    })
}

//render bans--------------------------------------------------

    const bansRender=info.bans.map(b=>(
        <div className={styles.user} key={b.user_id}>
            <div className={styles.profileImg} style={{background:`var(--${b.politic})`}}>
                {b.image&&<img src={imgLink+b.image}/>}
            </div>
            <div style={{color:`var(--${b.politic})`}}>
                <h4>@{b.username}</h4>
                <h3>{b.name}</h3>
            </div>
            <button onClick={()=>removeBan(b.user_id)}>Unban</button>
        </div>
    ))

  return (
    <div className={styles.full}>
        <div className={styles.mask} onClick={cancel}></div>
        <div className={styles.container}>
            <div className={styles.bans}>{bansRender}</div>
        </div>
    </div>
  )
}
