import {useState,useEffect} from 'react'
import styles from '../../styles/game/userInfo.module.css'
import { FaHeart } from 'react-icons/fa';

export default function UserInfo({global}){
const {uInfo,setUInfo,setMode,user,room_id,userInfo,setGridError,info,setInfo,assets,setAssets,socket,rmvUser}=global
const[val,setVal]=useState('')
const[c,setC]=useState(false)
const [confirm,setConfirm]=useState(false)
const api=process.env.NEXT_PUBLIC_API
const imgLink=process.env.NEXT_PUBLIC_IMG

  useEffect(()=>{
    setVal(uInfo.permission)
  },[])

  function cancel(){
      setUInfo(false)
  }

  function cVal(e){
    setVal(e)
    setC(true)
  }

  function submit(){
    if(val==='ban'&&!confirm){
      return setConfirm(true)
    }
    if(val==='kick'){
      setUInfo(false)
      rmvUser('watcher',uInfo.user_id)
      rmvUser('stage',uInfo.user_id)
      rmvUser('admin',uInfo.user_id)
      return socket.emit('kick',uInfo.user_id,room_id)
    }
    const formData=new FormData()
    formData.append('room_id',room_id)
    formData.append('user_id',uInfo.user_id)
    formData.append('val',val)
    fetch(api+'updateuser',{
      method:'POST',
      headers:{
        Authorization:'Bearer '+user
      },
      body:formData
    }).then(res=>res.json())
    .then(res=>{
      if(res.error){
        setMode('select')
        setUInfo(false)
        return setGridError(res.error)
      }
      if(val==='ban'){
        socket.emit('ban',uInfo.user_id,room_id)
        rmvUser('watcher',uInfo.user_id)
        rmvUser('stage',uInfo.user_id)
        rmvUser('admin',uInfo.user_id)
        const{image,user_id,name,politic}=uInfo
        const newList=[...info.bans,{image,user_id,name,politic}]
        const newAss=assets.filter(a=>a.user_id!==uInfo.user_id)
        setAssets(newAss)
        setInfo(pre=>({...pre,bans:newList}))
      }
      setMode('select')
      setUInfo(false)
    })
  }

  function conf(e){
    setConfirm(e)
  }


  return (
    <div className={styles.full}>
      <div className={styles.mask} onClick={cancel}></div>
      {!confirm&&<div className={styles.container}>
        <div className={styles.profileImg} style={{background:`var(--${uInfo.politic})`}}>
          {uInfo.image&&<img src={imgLink+uInfo.image}/>}
        </div>
        <h4 style={{color:`var(--${uInfo.politic})`}}>@{uInfo.username}</h4>
        <h3 style={{color:`var(--${uInfo.politic})`}}>{uInfo.name}</h3>
        <div style={{borderColor:`var(--${uInfo.politic})`,color:`var(--${uInfo.politic})`}} className={styles.bio}>{uInfo.bio}</div>

        {(userInfo.permission==='admin'&&uInfo.user_id!==userInfo.user_id)&&<>
        <div className={styles.admin}>
          {val==='watcher'&&<button className={styles.watcherOn}>Watcher</button>}
          {val!=='watcher'&&<button onClick={()=>cVal('watcher')} className={styles.watcherOff}>Watcher</button>}
          {val==='stage'&&<button className={styles.stageOn}>Stage</button>}
          {val!=='stage'&&<button onClick={()=>cVal('stage')} className={styles.stageOff}>Stage</button>}
          {val==='admin'&&<button className={styles.adminOn}>Admin</button>}
          {val!=='admin'&&<button onClick={()=>cVal('admin')} className={styles.adminOff}>Admin</button>}
        </div>
        <div className={styles.ban}>
          {val==='kick'&&<button className={styles.kickOn}>Kick</button>}
          {val!=='kick'&&<button onClick={()=>cVal('kick')} className={styles.kickOff}>Kick</button>}
          {val==='ban'&&<button className={styles.banOn}>Ban</button>}
          {val!=='ban'&&<button onClick={()=>cVal('ban')} className={styles.banOff}>Ban</button>}
        </div>
        {c&&<button onClick={submit} className={styles.confirmOn}>Confirm</button>}
        {!c&&<button className={styles.confirmOff}>Confirm</button>}
        </>}
        <div className={styles.heart}>
            <FaHeart size={30}/>
            <h1>{uInfo.hearts}</h1>
        </div>
      </div>}
      {confirm&&<div className={styles.confirm}>
          <div>Are you sure you want to ban this user? All his assets will be deleted permanently.</div>
          <button onClick={submit}>Confirm</button>
          <button className={styles.return} onClick={()=>conf(false)}>Return</button>
        </div>}
    </div>
  )
}
