import { useRouter } from 'next/router'
import {useEffect,useState,useContext, useRef} from 'react'
import styles from '../../styles/game/right.module.css'
import { UserContext } from '../context/userContext'

export default function Right({global}){

    const {info,setInfo,userInfo,clickUser,addMsg}=global
    const [message,setMessage]=useState('')
    const [more,setMore]=useState(false)
    const [oldHeight,setOldHeight]=useState(0)
    const [maxHeight,setMaxHeight]=useState({m1:0,m2:0})
    const {user}=useContext(UserContext)
    const router=useRouter()
    const room_id=router.query.r
    const api=process.env.NEXT_PUBLIC_API
    const imgLink=process.env.NEXT_PUBLIC_IMG

//message--------------------------------------------------------

    const chatRef=useRef(null)

    function changeVal(e){
        setMessage(e.target.value)
    }

    function sendMessage(){
        if(!message)return
        setMessage('')
        const formData=new FormData()
        formData.append('room_id',room_id)
        formData.append('message',message)
        if(message){
            fetch(api+'createmessage',{
                method:'POST',
                headers:{
                    Authorization:'Bearer '+user
                },
                body:formData
            }).then(res=>{
                addMsg(message)
            })
        }
    }

    function enterMsg(e){
        e.preventDefault()
        if(e.keyCode === 13)sendMessage()
    }
    
    useEffect(()=>{
        if(maxHeight.m1-maxHeight.m2>50)return
        chatRef.current.scrollTop=chatRef.current.scrollHeight
    },[info.chat])

    function scrolling(){
        const crf=chatRef.current
        setMaxHeight({m1:crf.scrollHeight-crf.clientHeight
            ,m2:crf.scrollTop})
    }

//more msg--------------------------------------------------------

    useEffect(()=>{
        if(info.chat.length<30)return
        setMore(true)
    },[])

    function moreMsg(){
        setOldHeight(chatRef.current.scrollHeight)
        const formData=new FormData()
        formData.append('room_id',room_id)
        formData.append('length',info.chat.length)
        fetch(api+'moremessages',{
            method:'POST',
            body:formData
        }).then(res=>res.json())
        .then(res=>{
            setInfo(pre=>({...pre,chat:[...res.chat.reverse(),...pre.chat]}))
            if(res.more){
                return setMore(true)
            }
            setMore(false)
        })
    }

    useEffect(()=>{
        if(!oldHeight)return
        chatRef.current.scrollTop=chatRef.current.scrollHeight-oldHeight
        setOldHeight(0)
    },[info.chat])

//render chat--------------------------------------------------------

    const ProfileImg=({url,politic,e})=>(
        <div onClick={()=>clickUser(e)} className={styles.profileImg} style={{backgroundColor:'var(--'+politic+')'}}>
            {url&&<img src={url?imgLink+url:''}/>}
        </div>
    )

    const renderChat=info.chat.map(msg=>(
    <div key={msg.message_id}>
        <div className={styles.message} style={{display:'flex'}}>
            <ProfileImg e={msg} url={msg.image} politic={msg.politic}/>
            <div className={styles.text}>
                <h3 onClick={()=>clickUser(msg)} style={{color:`var(--${msg.politic})`}}>{msg.name}</h3>
                <p>{msg.message}</p>
            </div>
        </div>
    </div>)
    )

//render admins--------------------------------------------------------

const renderAdmin=info.admin.map(u=>(<div onClick={()=>clickUser(u)} className={styles.admin} key={u.user_id}>
    <ProfileImg url={u.image} politic={u.politic}/>
    <span>{user.name}</span>
</div>))

const renderStage=info.stage.map(u=>(<div onClick={()=>clickUser(u)} className={styles.admin} key={u.user_id}>
    <ProfileImg url={u.image} politic={u.politic}/>
    <span>{user.name}</span>
</div>))

const renderWatcher=info.watcher.map(u=>(<div onClick={()=>clickUser(u)} className={styles.admin} key={u.user_id}>
    <ProfileImg url={u.image} politic={u.politic}/>
    <span>{user.name}</span>
</div>))

//render-----------------------------------------------------------------

  return (
    <div className={styles.full}>
        <div className={styles.fullUsers}>
            <h1>Users</h1>
            <div className={styles.users}>
                <h2>Admins</h2>
                <div className={styles.admins}>
                    {renderAdmin}
                </div>
                <h2>Stage</h2>
                <div className={styles.stage}>
                    {renderStage}
                </div>
                <h2>Watchers</h2>
                <div className={styles.watchers}>
                    {renderWatcher}
                </div>
            </div>
        </div>

        <div className={styles.fullChat}>
            <h1>Chat</h1>
            <div className={styles.chat} style={{height:user==='notLogged'?'calc(100% - 44px)':''}} ref={chatRef} onScroll={scrolling}>
                {more&&<div className={styles.more} onClick={moreMsg}>show more messages</div>}
                {renderChat}
            </div>
            {(user!=='notLogged'&&user!=='empty')&&<div className={styles.typer}>
                <input onChange={(e)=>changeVal(e)} placeholder='type message...' value={message} onKeyUp={e=>enterMsg(e)}/>
                <button onClick={sendMessage}>Send</button>
            </div>}
        </div>
    </div>
  )
}
