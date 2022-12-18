import React, { useState,useContext, useEffect } from 'react'
import styles from '../../styles/create/createCard.module.css'
import Politic from '../profile/account/Politic'
import AddImage from '../AddImage'
import { UserContext } from '../context/userContext'
import { useRouter } from 'next/router'

export default function CreateCard() {

    const [info,setInfo]=useState({displayImg:'',sendImg:'',name:'',timer:true})
    const [error,setError]=useState('')
    const [politic,setPolitic]=useState({red:false,blue:false,grey:true,green:false,purple:false})
    const [privacy,setPrivacy]=useState({public:true,unlisted:false,private:false})
    const [ratio,setRatio]=useState('')
    const {user}=useContext(UserContext)
    const router=useRouter()
    const api=process.env.NEXT_PUBLIC_API

//check login---------------------------------------------------

  function checkLog(){
    const user=JSON.parse(localStorage.getItem('jwt'))
    console.log(user)
    if(!user){
      router.push('/login')
    }
  }

  useEffect(()=>{
    checkLog()
  },[router.isReady])

//info---------------------------------------------------

function changeVal(e){
    const {value,name}=e.target
    const size=e.target.files?e.target.files[0].size/1000:0
    if(size>2100){
        setError('Image Size must be Under 2MB')
        return
    }
    if(e.target.files && e.target.files[0]) {
        var reader = new FileReader();
        reader.onload = function(){
          setInfo({...info,displayImg:reader.result,sendImg:e.target.files[0]})
        };
        reader.readAsDataURL(e.target.files[0]);
    }
    if(name!=='displayImg'){
        setInfo({...info,[name]:value})
    }
}

function changeTimer(){
  setInfo({...info,timer:!info.timer})
}

//privacy-----------------------------------------------

function changePrv(e){
  setPrivacy({public:false,unlisted:false,private:false,[e]:true})
}

function privacyColor(e){
  if(privacy[e]){
    return{background:'var(--purple)',color:'white'}
  }
}

//submite-create-----------------------------------------------

  function create(){
    const{name,sendImg,timer}=info
    const polArray=Object.keys(politic)
    const pol=polArray.find(p=>politic[p])
    const prvArray=Object.keys(privacy)
    const prv=prvArray.find(p=>privacy[p])
    const formData=new FormData()
    formData.append('image',sendImg)
    formData.append('name',name)
    formData.append('privacy',prv)
    formData.append('politic',pol)
    formData.append('ratio',ratio)
    formData.append('timer',timer)
    if(user!=='notLogged'&&user!=='empty'&&name){
      fetch(api+'create',{
        method:'POST',
        headers:{
          Authorization:'Bearer '+user
        },
        body:formData
      }).then(res=>res.json())
      .then(res=>{
        if(res.error){
          return setError(res.error)
        }
        router.push('/profile')
      })
    }else{
      setError('Info not filled.')
    }
  }

  return (
    <div className={styles.full}>
        <div className={styles.top}>
            <h1>CREATE ROOM</h1>
            <h2>Add a new room</h2>
            {error&&<div className={styles.error}>{error}</div>}
        </div>
        <div className={styles.info}>
            <div className={styles.left}>
              <div className={styles.image}>
                <AddImage info={info} politic={politic} changeVal={changeVal} padding='20px' setRatio={setRatio}/>
              </div>
              <div className={styles.politic}>
                <Politic politic={politic} setPolitic={setPolitic}/>
              </div>
            </div>
            <div className={styles.right}>
            <label htmlFor='2' >Room Name:</label>
                <input name='name' id='2' onChange={(e)=>changeVal(e)} placeholder='insert room name' value={info.name} maxLength={40}/>

                <label htmlFor='3' >Privacy:</label>
                <div className={styles.privacy}>
                    <div onClick={()=>changePrv('public')} style={privacyColor('public')}><h1>Public</h1></div>
                    <div onClick={()=>changePrv('unlisted')} style={privacyColor('unlisted')}><h1>Unlisted</h1></div>
                    <div onClick={()=>changePrv('private')} style={privacyColor('private')}><h1>Private</h1></div>
                </div>
            </div>
        </div>
        <div className={styles.timer} onClick={changeTimer}>
          {info.timer&&<div className={styles.on}>Timer On</div>}
          {!info.timer&&<div className={styles.off}>Timer Off</div>}
        </div>
        <div className={styles.button}><button onClick={create}>CREATE</button></div>
    </div>
  )
}