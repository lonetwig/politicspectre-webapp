import {useContext, useEffect, useState} from 'react'
import styles from '../../styles/game/left.module.css'
import { FaHeart,FaHeartBroken } from 'react-icons/fa';
import { HiUser } from 'react-icons/hi';
import {UserContext} from '../context/userContext'
import Selectors from './Selectors';

export default function Left({global}) {

    const{info,love,mode,setMode,userInfo,setInfo,setAssetSize,setAdd,nop,setMaxSize,setSquare,setSelect,allPos,setAllPos,setTime,assets,time,clickAsset,canvRef,setScreenshot}=global
    const {user}=useContext(UserContext)
    const [ct,setCt]=useState(0)

//assets------------------------------------------------------------

    const renderAssets=assets.map(a=>(
        <div key={a.content_id} className={styles.asset} onClick={()=>clickAsset(a)}>
            {a.type!=='text'&&<img src={a.content}/>}
            {a.type==='text'&&<div>{a.content[0].toUpperCase()}</div>}
        </div>
    ))

//timer------------------------------------------------------------

    function countTime(){
        if(info.timer!==0&&time>=0){
            const {last_post_time:lpt,last_timer:lt}=userInfo
            const timeNow=parseInt(Date.now()/1000)
            const checkT=lt<info.timer?lt:info.timer
            let t=lpt-timeNow+checkT
            setTimeout(()=>{setTime(t<0?0:t),setCt(pre=>pre+1)})
        }
    }

    useEffect(()=>{
        countTime()
    },[info])


    useEffect(()=>{
        if(time>0){
            setTimeout(countTime,500)
        }
    },[ct,userInfo,info])


  return (
    <div className={styles.full}>
        <div className={styles.top}>
            <div className={styles.title}>
                <h1>{info.name}</h1>
                {(user!=='notLogged'&&user!=='empty')&&<>
                {info.loved&&<div className={styles.heartButtonRed} onClick={()=>love('unloveroom')}>
                    <div className={styles.fullHeart}><FaHeart size={34}/></div>
                    <div className={styles.broken}><FaHeartBroken size={34}/></div>
                </div>}
                {!info.loved&&<div className={styles.heartButtonGrey} onClick={()=>love('loveroom')}>
                    <div className={styles.fullHeart}><FaHeart size={34}/></div>
                </div>}
                </>}
                
            </div>

            <div className={styles.hearts}><FaHeart size={20}/><h2>{info.hearts}</h2></div>

            <div className={styles.users}><HiUser size={20}/>
                <h2>{info.user_in_room}</h2>
            </div>

            {info.timer!==0&&(user!=='notLogged'&&user!=='empty')&&<><div className={styles.timer}>{time}</div>
            <div className={styles.timerText}>Timer</div></>}
            
        </div>

        <div className={styles.bottom}>
            <Selectors global={{setMode,setAssetSize,setAdd,nop,setMaxSize,setSquare,setSelect,allPos,setAllPos,userInfo,mode,info,time,setInfo,info,canvRef,setScreenshot}}/>
            <div className={styles.assets}>
                <div className={styles.top}>
                    <h1>Assets</h1>
                    <h1>{assets.length}/200</h1>
                </div>
                <div className={styles.assetImage}>
                    <div>{renderAssets}</div>
                </div>
            </div>
        </div>
    </div>
  )
}
