import { useState,useContext,useEffect } from 'react'
import styles from '../../styles/login/loginCard.module.css'
import axios from 'axios'
import { useRouter } from 'next/router'
import { UserContext } from '../context/userContext'

export default function LoginCard() {
    
    const [info,setInfo]=useState({username:'',password:''})
    const [error,setError]=useState('')
    const router=useRouter()
    const {user,setUser}=useContext(UserContext)
    const api=process.env.NEXT_PUBLIC_API

//changeval-----------------------------------------

    function changeVal(e){
        const{name,value}=e.target
        setInfo({...info,[name]:value})
    }

//login----------------------------------------------

    function login(){
        const{username,password}=info
        if(username,password){
            axios.post(api+'login',{
            user:username,password
            }).then(({data})=>{
                if(data.error){
                    setError(data.error)
                    return
                }
                localStorage.setItem('jwt',JSON.stringify(data.token))
                setUser(data.token)
                router.push('/rooms')
            })
        }else{
            setError('Info not filled.')
        }
    }

    function enterLog(e){
        e.preventDefault()
        if(e.keyCode === 13)login()
    }

//logout-------------------------------------------------------------------

useEffect(()=>{
    localStorage.removeItem('jwt')
    // setUser('notLogged')
},[router.isReady])

    
  return (
    <div className={styles.full}>
    <div className={styles.top}>
        <h1>LOG IN</h1>
        <h2>Enter your account info</h2>
    </div>

    <div className={styles.info}>
        <div className={styles.left}>
            {error&&<div className={styles.error}>{error}</div>}
            <label htmlFor='1'>Username or Email:</label>
            <input name='username' id='1' onChange={(e)=>changeVal(e)}
            onKeyUp={e=>enterLog(e)} placeholder='insert username or email' 
            value={info.username}/>

            <label htmlFor='2' >Password:</label>
            <input type='password' id='2' onChange={(e)=>changeVal(e)} 
            onKeyUp={e=>enterLog(e)} placeholder='insert a password' name='password' 
            value={info.password}/>
        </div>
    </div>

    <div className={styles.button}>
        <button onClick={login}>LOG IN</button>
    </div>
</div>  
  )
}
