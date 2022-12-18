import React, { useEffect,useState } from 'react'
import styles from '../../styles/game/setting.module.css'

export default function Setting({global}){
    const{user,setSetting,mode,setMode,userInfo,info,setInfo,room_id,setGridError,setTime}=global
    const [newInfo,setNewInfo]=useState({newTimer:'',newMaxSquares:'',newPrivacy:'',upd:false})
    const [counter,setCounter]=useState(2)
    const [counterT,setCounterT]=useState(2)
    const sizes=[1,4,9,16,25,36,50,100,200,500,1000,1600]
    const times=[0,60,120,300,600,1200,3600]
    const [confirm,setConfirm]=useState(false)
    const api=process.env.NEXT_PUBLIC_API

    function cancel(){
        setSetting(false)
        setMode('select')
    }

//new vals----------------------------------------------------

    useEffect(()=>{
        setNewInfo({newTimer:info.timer,
        newMaxSquares:info.maxSquares,newPrivacy:info.privacy,})
        setCounter(sizes.indexOf(info.maxSquares))
        setCounterT(times.indexOf(info.timer))
    },[])

//timer----------------------------------------------------

function addT(){
    setNewInfo({...newInfo,newTimer:times[counterT+1]?times[counterT+1]:3600,upd:true})
    setCounterT(pre=>counterT<5?pre+1:5)
}

function subT(){
    setNewInfo({...newInfo,newTimer:times[counterT-1]?times[counterT-1]:0,upd:true})
    setCounterT(pre=>counterT>1?pre-1:1)
}

//max assets----------------------------------------------------

    function addAss(){
        setNewInfo({...newInfo,newMaxSquares:sizes[counter+1]?sizes[counter+1]:1600,upd:true})
        setCounter(pre=>counter<10?pre+1:10)
    }

    function subAss(){
        setNewInfo({...newInfo,newMaxSquares:sizes[counter-1]?sizes[counter-1]:1,upd:true})
        setCounter(pre=>counter>1?pre-1:1)
    }

//chnage privacy-------------------------------------------------

    function prv(e){
        setNewInfo({...newInfo,newPrivacy:e,upd:true})
    }

//update room----------------------------------------------------

    function submit(){
        const{newMaxSquares,newPrivacy,newTimer}=newInfo
        const formData=new FormData()
        formData.append('room_id',room_id)
        formData.append('maxSquares',newMaxSquares)
        formData.append('privacy',newPrivacy)
        formData.append('timer',newTimer)
        fetch(api+'updateroom',{
          method:'POST',
          headers:{
            Authorization:'Bearer '+user
          },
          body:formData
        }).then(res=>res.json())
        .then(res=>{
            setSetting(false)
            if(res.error){
                setMode('select')
                return setGridError(res.error)
            }
            setInfo({...info,maxSquares:newMaxSquares,
                privacy:newPrivacy,timer:newTimer})
            setMode('select')
            if(newTimer===0){
                setTimeout(()=>setTime(0),600)
            }
        })
    }

//delete room----------------------------------------------------

    function conf(e){
        setConfirm(e)
    }

    function deleteRoom(){
        const formData=new FormData()
        formData.append('room_id',room_id)
        fetch(api+'removeroom',{
          method:'POST',
          headers:{
            Authorization:'Bearer '+user
          },
          body:formData
        }).then(res=>res.json())
        .then((res)=>{
            setSetting(false)
            if(res.error){
                setGridError(res.error)
                return setMode('select')
            }
        })
    }

  return (
    <div className={styles.full}>
        <div onClick={cancel} className={styles.mask}></div>
        {!confirm&&<div className={styles.container}>
        <h1>Timer</h1>
            <div className={styles.maxSize}>
                <div className={styles.sub} onClick={subT}>-</div>
                <div className={styles.num}>{newInfo.newTimer}s</div>
                <div className={styles.add} onClick={addT}>+</div>
            </div>
            <h1>Max Assets Size</h1>
            <div className={styles.maxSize}>
                <div className={styles.sub} onClick={subAss}>-</div>
                <div className={styles.num}>{newInfo.newMaxSquares}</div>
                <div className={styles.add} onClick={addAss}>+</div>
            </div>
            <h1>Privacy</h1>
            <div className={styles.privacy}>
                {newInfo.newPrivacy==='public'&&<div className={styles.pbOn}>Public</div>}
                {newInfo.newPrivacy!=='public'&&<div className={styles.pbOff} onClick={()=>prv('public')}>Public</div>}
                {newInfo.newPrivacy==='unlisted'&&<div className={styles.unlOn}>Unlisted</div>}
                {newInfo.newPrivacy!=='unlisted'&&<div className={styles.unlOff} onClick={()=>prv('unlisted')}>Unlisted</div>}
                {newInfo.newPrivacy==='private'&&<div className={styles.prvOn}>Private</div>}
                {newInfo.newPrivacy!=='private'&&<div className={styles.prvOff} onClick={()=>prv('private')}>Private</div>}
            </div>
            {newInfo.upd&&<button className={styles.update} onClick={submit}>Update Room</button>}
            {!newInfo.upd&&<button className={styles.updateOff}>Update Room</button>}
            <button onClick={()=>conf(true)} className={styles.delete}>Delete Room</button>
        </div>}
        {confirm&&<div className={styles.confirm}>
          <div>Are you sure you want to delete this room? All the assets and informations will be deleted permanently.</div>
          <button onClick={deleteRoom}>Confirm</button>
          <button className={styles.return} onClick={()=>conf(false)}>Return</button>
        </div>}
    </div>
  )
}
