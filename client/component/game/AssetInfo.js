import React, { useState,useEffect } from 'react'
import styles from '../../styles/game/assetInfo.module.css'

export default function AssetInfo({global}){
const {clickAsset,setAssetInfo,assetInfo,userInfo,setMode,mode,info,setInfo,user,room_id,setGridError,assets,setAssets,socket,rmvUser}=global
  const [confirm,setConfirm]=useState(false)
  const api=process.env.NEXT_PUBLIC_API

    function cancel(){
        setAssetInfo(false)
    }

//deleteAsset--------------------------------------------------------------

    function deleteAss(){
      setMode('erase')
      socket.emit('erase_asset',assetInfo.content_id,room_id)
    }
    useEffect(()=>{
        if(mode==='erase'&&assetInfo){
            clickAsset(assetInfo,()=>{
                setMode('select')
                setAssetInfo(false)
            })
        }
    },[mode])

//ban--------------------------------------------------------------

function conf(e){
  setConfirm(e)
}

function ban(){
  if(userInfo.permission==='admin'){
    const formData=new FormData()
    formData.append('room_id',room_id)
    formData.append('user_id',assetInfo.user_id)
    fetch(api+'banuser',{
        method:'POST',
        headers:{
          Authorization:'Bearer '+user
        },body:formData
      }).then(res=>res.json())
      .then(res=>{
        if(res.error){
          setGridError(res.error)
          setAssetInfo(false)
          setMode('select')
        }
        socket.emit('ban',assetInfo.user_id,room_id)
        rmvUser('watcher',assetInfo.user_id)
        rmvUser('stage',assetInfo.user_id)
        rmvUser('admin',assetInfo.user_id)
        const{image,user_id,name,politic,username}=assetInfo
        const newList=[...info.bans,{image,user_id,name,politic,username}]
        const newAss=assets.filter(a=>a.user_id!==assetInfo.user_id)
        setAssets(newAss)
        setInfo(pre=>({...pre,bans:newList}))
        setMode('select')
        setAssetInfo(false)
    })
  }
}
//style--------------------------------------------------------------

function textBorder(){
    const comb=[0,1,-1,2,-2]
    let textBorder=''
    for(let i=0;i<comb.length;i++){
      comb.forEach(comb1=>{
        textBorder+=comb[i]+'px '+comb1+'px grey,'
      })
    }
    return textBorder.substring(0,textBorder.length-1)
  }

  return (
    <div className={styles.full}>
      <div className={styles.mask} onClick={cancel}></div>
      {!confirm&&<div className={styles.container}>
        <div className={styles.content}>
            {assetInfo.type!=='text'&&<img src={assetInfo.content}/>}
            {assetInfo.type==='text'&& <div style={{textShadow:textBorder()}}>{assetInfo.content}</div>}
        </div>
        <div className={styles.account} style={{color:`var(--${assetInfo.politic})`}}>@{assetInfo.username}</div>
        <div className={styles.name} style={{color:`var(--${assetInfo.politic})`}}>{assetInfo.name}</div>
        {userInfo.permission==='admin'&&<>
            <button className={styles.erase} onClick={deleteAss}>Erase</button>
            {info.owner!==assetInfo.user_id&&<button onClick={()=>conf(true)} className={styles.ban}>Ban</button>}
        </>}
      </div>}
      {confirm&&<div className={styles.confirm}>
          <div>Are you sure you want to ban this user? All his assets will be deleted permanently.</div>
          <button onClick={ban}>Confirm</button>
          <button className={styles.return} onClick={()=>conf(false)}>Return</button>
        </div>}
    </div>
  )
}
