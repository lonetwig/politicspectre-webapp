import {useState,useEffect, useContext,useRef} from 'react'
import styles from '../../styles/game/gameCard.module.css'
import Grid from './Grid'
import Add from './Add'
import Left from './Left'
import Right from './Right'
import { useRouter } from 'next/router'
import { UserContext } from '../context/userContext'
import Loading from '../Loading'
import AssetInfo from './AssetInfo'
import Setting from './Setting'
import UserInfo from './UserInfo'
import BanList from './BanList'
import io from 'socket.io-client'
import useSWR from 'swr'
import Head from 'next/head'
const api=process.env.NEXT_PUBLIC_API
const imgLink=process.env.NEXT_PUBLIC_IMG

const socket = io(imgLink,{transports: ['websocket']})

export default function game() {

  const [info,setInfo]=useState({squaresCount:0,maxSquares:100,loved:false,permission:'',name:'',privacy:'',owner:'',user_in_room:'',hearts:'',chat:[],admin:[],stage:[],watcher:[],bans:[],timer:false})
  const [assets,setAssets]=useState([])
  const [assetSize,setAssetSize]=useState({_top:0,_right:0,_bottom:0,_left:0})
  const [add,setAdd]=useState(false)
  const [userInfo,setUserInfo]=useState({permission:'watcher',last_post_time:0,last_timer:0})
  const [mode,setMode]=useState('select')
  const [loading,setLoading]=useState({})
  const [square,setSquare]=useState({_top:0,_right:0,_bottom:0,_left:0})
  const [allPos,setAllPos]=useState([])
  const [select,setSelect]=useState(false)
  const nop=40
  const ps=100/nop
  const [maxSize,setMaxSize]=useState({biggestX:-1,biggestY:-1,smallestX:nop+1,smallestY:nop+1})
  const router=useRouter()
  const {user,setUser}=useContext(UserContext)
  const room_id=router.query.r
  const [error,setError]=useState(false)
  const [gridError,setGridError]=useState(false)
  const [textCheck,setTextCheck]=useState([])
  const squareRef=useRef()
  const textRef=useRef()
  const [endSelect,setEndSelect]=useState(false)
  const [time,setTime]=useState(0)
  const [assetInfo,setAssetInfo]=useState(false)
  const [setting,setSetting]=useState(false)
  const [uInfo,setUInfo]=useState(false)
  const [banList,setBanList]=useState(false)
  const [screenShot,setScreenShot]=useState(false)
  const canvRef=useRef()

  function changeAdd(){
    setAdd(false)
  }
  
  //user----------------------------------------------

  function userInRoom(option){
      if(!room_id)return
      if(user!=='notLogged'&&user!=='empty'){
      const formData=new FormData()
      formData.append('room_id',room_id)
      fetch(api+option,{
        method:'POST',
        headers:{
          Authorization:'Bearer '+user
        },body:formData
      }).then(res=>res.json())
      .then(res=>{
        setLoading(pre=>({...pre,user:true}))
      })
    }else{
      setLoading(pre=>({...pre,user:true}))
    }
  }
  
  useEffect(()=>{
    if(!loading.info)return
      // const checkJwt=JSON.parse(localStorage.getItem('jwt'))
      // if(!checkJwt&&user!=='notLogged')return router.push('/login')
      userInRoom('addusertoroom')
  },[loading.info])


  useEffect(()=>{
    const w=window?window:''
    const int=setInterval(()=>{
      if(!room_id)return
      const checkJwt=JSON.parse(localStorage.getItem('jwt'))
      if(!checkJwt&&user!=='notLogged')return router.push('/login')
      userInRoom('addusertoroom')
    },5000)  
    const cleanup = () => {
      if(user!=='notLogged'&&user!=='empty'){
        clearInterval(int)
        userInRoom('removeuserfromroom')
      }
    }
    w.addEventListener('beforeunload', cleanup);

    return () => {
      cleanup()
      w.removeEventListener('beforeunload', cleanup);
    }
  },[router.isReady])

//love-----------------------------------------------------------

function love(option){
  if(!room_id)return
  const formData=new FormData()
  formData.append('room_id',room_id)
  if(user!=='notLogged'&&user!=='empty'){
      fetch(api+option,{
        method:'POST',
        headers:{
            Authorization:'Bearer '+user
        },
        body:formData
    }).then(res=>res.json())
    .then(res=>{
      setInfo(pre=>({...pre,loved:res.loved}))
    })
  }
}

function checkLove(){
  if(!room_id)return
  const formData=new FormData()
  formData.append('room_id',room_id)
  if(user!=='notLogged'&&user!=='empty'){
    fetch(api+'checklove',{
      method:'POST',
      body:formData,
      headers:{
          Authorization:'Bearer '+user
      }
    }).then(res=>res.json())
    .then(res=>{
      setInfo(pre=>({...pre,loved:res.loved}))
      setLoading(pre=>({...pre,loved:true}))
    })
  }else{
    setLoading(pre=>({...pre,loved:true}))
  }
}

//get room info----------------------------------------------

function getRoomInfo(){
  if(!room_id)return
  if(user!=='empty'){
    const formData=new FormData()
    formData.append('room_id',room_id)
    fetch(api+'getroominfo',{
        method:'POST',
        body:formData,
        headers:{
          Authorization:'Bearer '+user
        }
    })
    .then(res=>res.json())
    .then(({roomInfo:ri,error})=>{
      if(error){
        setLoading(pre=>({...pre,info:false}))
        return setError(error)
      }
      setInfo(pre=>({...pre,name:ri.room_name,privacy:ri.privacy,owner:ri.owner,user_in_room:ri.user_in_room,hearts:ri.hearts,timer:ri.timer,maxSquares:ri.max_size}))
      setLoading(pre=>({...pre,info:true}))
    })
  }
}

useEffect(()=>{
  if(user.error)return 
  if(loading.info){
    checkLove()
    getChat().then(()=>{
      getAssets().then(()=>{
        socket.emit('join_room',room_id)
        setLoading(pre=>({...pre,assets:true}))
      })
    })
  }
},[loading.info])

const{x,y}=useSWR('room',getRoomInfo)

  useEffect(()=>{
    getRoomInfo()
  },[router.isReady])

//chat--------------------------------------------------------

function getChat(){
  if(user.error)return 
  if(!room_id)return
  if(room_id){
    const formData=new FormData()
    formData.append('room_id',room_id)
    return fetch(api+'getchat',{
      method:'POST',
      body:formData
    }).then(res=>res.json())
    .then(res=>{
      setInfo(pre=>({...pre,chat:res.chat.reverse()}))
    })
  }
}

function addMsg(msg){
  if(user.error)return 
  const {username,bio,hearts,image,name,permission,politic,user_id}=userInfo
  socket.emit('add_msg',{username,bio,hearts,image,name,permission,politic,user_id},msg,room_id)
  const chat=[...info.chat,{username,bio,hearts,image,name,permission,politic,user_id,message:msg,message_id:Date.now()}]
  setInfo(pre=>({...pre,chat}))
}

socket.on('res_msg',(user,msg)=>{
  const chat=[...info.chat,{...user,message:msg,message_id:Date.now()}]
  setInfo(pre=>({...pre,chat}))
})


//admins--------------------------------------------------------

function getAdmins(){
  if(!room_id)return
  if(loading.user&&!error){
    const formData=new FormData()
    formData.append('room_id',room_id)
    return fetch(api+'getadmins',{
      method:'POST',
      headers:{
        Authorization:'Bearer '+user
      },
      body:formData
    }).then(res=>res.json())
    .then(res=>{
      if(res.admins){
        const watcher=res.admins.filter(e=>e.permission==='watcher')
        const stage=res.admins.filter(e=>e.permission==='stage')
        const admin=res.admins.filter(e=>e.permission==='admin')
        function addMe(arr,perm){
          if(res.me){
            if(res.me.permission===perm){
              arr=arr.filter(e=>e.user_id!==res.me.user_id)
              arr.push(res.me)
            } 
          }
        }
        addMe(watcher,'watcher')
        addMe(stage,'stage')
        addMe(admin,'admin')

        setInfo(pre=>({...pre,watcher,stage,admin}))
        setUserInfo(res.me?res.me:'watcher')
      }
      setLoading(pre=>({...pre,admins:true}))
    })
  }
}


const{data,err}=useSWR('admin',getAdmins)

useEffect(()=>{
    getAdmins()
},[loading.user])



//assets--------------------------------------------------------

function getAssets(){
  if(!room_id)return
  if(user.error)return 
  const formData=new FormData()
  formData.append('room_id',room_id)
  return fetch(api+'getassets',{
    method:'POST',
    body:formData
  }).then(res=>res.json())
  .then(res=>{
    const newRes=res.assets.map(a=>(
      {...a,content:a.type==='image'?imgLink+a.content:a.content}))
    setAssets(newRes)
  })
}

function addAss(ass){
  socket.emit('add_asset',ass,room_id)
}

useEffect(()=>{
  socket.on('res_add_asset',(ass)=>{
    setAssets(pre=>([...pre,{...ass}]))
  })  
},[])
socket.on('res_erase_asset',(id)=>{
  const newAssets=assets.filter(ass=>ass.content_id!==id)
  setAssets(newAssets)
})

//asset click---------------------------------------------

function clickAsset(a,cb){
    if(!room_id)return
    if(mode==='erase'&&userInfo.permission==='admin'){
    const formData=new FormData()
    const con=a.type!=='image'?a.content:a.content.split(imgLink)[1]
    formData.append('room_id',room_id)
    formData.append('id',a.content_id)
    formData.append('content',con)
    return fetch(api+'deleteasset',{
        method:'POST',
        headers:{
          Authorization:'Bearer '+user
        },body:formData
      }).then(res=>res.json())
    .then(res=>{
      if(res.error){
        return setGridError(res.error)
      }
      socket.emit('erase_asset',a.content_id,room_id)
      const newAssets=assets.filter(ass=>ass.content_id!==a.content_id)
      setAssets(newAssets)
      cb()
    })
  }
  if(mode==='select'){
    setAssetInfo(a)
  }
}

//click user----------------------------------------------------------

function clickUser(e){
  setUInfo(e)
}

//setting--------------------------------------------------------------

useEffect(()=>{
  if(mode==='setting'){
    setSetting(true)
  }
},[mode])

//bans--------------------------------------------------------------

function getBans(){
  if(!room_id)return
  if(userInfo.permission==='admin'){
    const formData=new FormData()
    formData.append('room_id',room_id)
    fetch(api+'getbans',{
        method:'POST',
        headers:{
          Authorization:'Bearer '+user
        },body:formData
      }).then(res=>res.json())
      .then(res=>{
        setInfo(pre=>({...pre,bans:res.bans}))
    })
  }
}

useEffect(()=>{
  getBans()
},[userInfo.permission])

useEffect(()=>{
  if(mode==='ban'){
    setBanList(true)
  }
},[mode])

function rmvUser(perm,user_id){
  if(info[perm].some(p=>p.user_id===user_id)){
    const newPerms=info[perm].filter(p=>p.user_id!==user_id)
    setInfo(pre=>({...pre,[perm]:newPerms}))
  }
}

socket.on('res_kick',(id)=>{
  if(id===userInfo.user_id){
    router.push('/rooms')
  }
  rmvUser('watcher',id)
  rmvUser('admin',id)
  rmvUser('stage',id)
})

socket.on('res_ban',(id)=>{
  if(id===userInfo.user_id){
    router.push('/rooms')
  }
  if(userInfo.permission==='admin'){
    getBans()
  }
  const newAss=assets.filter(ass=>ass.user_id!==id)
  setAssets(newAss)
  rmvUser('watcher',id)
  rmvUser('admin',id)
  rmvUser('stage',id)
})

//error--------------------------------------------------------------

useEffect(()=>{
  setTimeout(()=>setGridError(false),5000)
},[gridError])

const title=info.name+' - POLITICSPECTRE'

//loading--------------------------------------------------------------

const loaded=loading.info&&loading.loved&&loading.user&&loading.admins&&loading.assets?true:false
return (
    <div className={styles.full}>
            <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <meta name='author' content='lone twig'/> 
      </Head>
      
      {(loaded&&!error)&&<>
        <div className={styles.left}><Left global={{info,love,mode,setMode,userInfo,setAssetSize,setAdd,nop,setMaxSize,setSquare,setSelect,allPos,setAllPos,setUserInfo,time,setTime,assets,clickAsset,setInfo,canvRef,setScreenShot}}/></div>
        
        <div className={styles.mid}>
          <Grid global={{assets,setAdd,info,setInfo,mode,setAssetSize,gridError,maxSize,setMaxSize,select,setSelect,allPos,setAllPos,square,setSquare,nop,ps,squareRef,textCheck,setTextCheck,add,endSelect,userInfo,clickAsset,canvRef}}/>
        </div>

        <div className={styles.right}><Right global={{info,setInfo,userInfo,setLoading,clickUser,addMsg}}/></div>

        {add&&<div>
          <div className={styles.addContainer} onClick={changeAdd}></div>
          <div className={styles.add}><Add global={{setAdd,assetSize,setAssets,setAssetSize,gridError,setGridError,squareRef,textCheck,setTextCheck,textRef,setEndSelect,endSelect,setUserInfo,userInfo,setMode,setTime,time,addAss}}/></div>
        </div>}

        {assetInfo&&<AssetInfo global={{clickAsset,setAssetInfo,assetInfo,userInfo,setMode,mode,info,user,room_id,setGridError,assets,setAssets,setInfo,socket,rmvUser}}/>}

        {setting&&<Setting global={{setting,setSetting,mode,setMode,userInfo,info,setInfo,room_id,user,setGridError,setTime,assets,setAssets}}/>}

        {uInfo&&<UserInfo global={{uInfo,setUInfo,setMode,user,room_id,userInfo,setGridError,info,setInfo,assets,setAssets,socket,rmvUser}}/>}

        {banList&&<BanList global={{info,setInfo,setBanList,setMode,room_id,user,setGridError}}/>}

      </>}
      {(!loaded&&!error)&&<Loading height={'100vh'} width={'100vw'}/>}
      {error&&<div className={styles.error}>
          <h1>{error}</h1>
        </div>}
    </div>
  )
}
