import {useContext, useEffect, useState} from 'react'
import styles from'../../styles/signup/signUpCard.module.css'
import Politic from '../profile/account/Politic'
import AddImage from '../AddImage'
import {useRouter} from 'next/router'
import { UserContext } from '../context/userContext'
import Loading from '../Loading'

export default function SignUpCard() {

const[info,setInfo]=useState({username:'',email:'',password:'',displayImg:'',sendImg:''})
const [politic,setPolitic]=useState({red:false,blue:false,grey:true,green:false,purple:false})
const [error,setError]=useState('')
const [loading,setLoading]=useState(false)
const {user,setUser}=useContext(UserContext)
const [ratio,setRatio]=useState('')
const router=useRouter()
const api=process.env.NEXT_PUBLIC_API

//changeval---------------------------------------------------

function changeVal(e){
    const {value,name}=e.target
    const size=e.target.files?e.target.files[0].size/1000:0
    if(size>2100){
        setError('Image Size must be Under 2MB')
        return
    }
    if(e.target.files && e.target.files[0]){
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

//submit---------------------------------------------------

function submitInfo(){
    const{username,email,password,sendImg}=info
    if(username,email,password){
    const ccc=Object.keys(politic)
    const pol=ccc.find(p=>politic[p])
    const formData=new FormData()
    formData.append('image',sendImg)
    formData.append('username',username)
    formData.append('email',email)
    formData.append('password',password)
    formData.append('politic',pol)
    formData.append('ratio',ratio)
    setLoading(true)
    fetch(api+'signup',{
    body:formData,
    method:'POST',
    }).then(res=>res.json()
    ).then(res=>{
        if(res.error){
            setError(res.error)
            setLoading(false)
            return
        }
        localStorage.setItem('jwt',JSON.stringify(res.token))
        setUser(res.token)
        router.push('/rooms')
        })
    }else{
        setError('Info not filled.')
    }
}

function enterLog(e){
    e.preventDefault()
    if(e.keyCode === 13)submitInfo()
}

//logout-------------------------------------------------------------------

useEffect(()=>{
    localStorage.removeItem('jwt')
    // setUser('notLogged')
},[])

  return (
    <div className={styles.full}>
        {!loading&&<>
        <div className={styles.top}>
            <h1>SIGN UP</h1>
            <h2>Create a new account</h2>
        </div>

        <div className={styles.info}>
            <div className={styles.left}>
                {error&&<div className={styles.error}>{error}</div>}
                <label htmlFor='1'>Username:</label>
                <input name='username' id='1' onChange={(e)=>changeVal(e)} onKeyUp={e=>enterLog(e)}placeholder='insert a name' value={info.username} maxLength={15}/>

                <label htmlFor='2' >Email:</label>
                <input name='email' id='2' onChange={(e)=>changeVal(e)} onKeyUp={e=>enterLog(e)}placeholder='insert your email' value={info.email} maxLength={129}/>

                <label htmlFor='3' >Password:</label>
                <input type='password' id='3' onChange={(e)=>changeVal(e)} onKeyUp={e=>enterLog(e)} placeholder='insert a password' name='password' value={info.password} maxLength={40}/>
            </div>
            <div className={styles.right}>
                <div className={styles.imgContainer}>
                    <div className={styles.image}>
                        <AddImage info={info} politic={politic} changeVal={changeVal} padding='20px' setRatio={setRatio}/>
                    </div>
                </div>

                <div className={styles.politic}>
                  <Politic politic={politic} setPolitic={setPolitic}/>
                </div>
            </div>
        </div>

        <div className={styles.button}>
            <button onClick={submitInfo}>CREATE</button>
        </div>
        </>}
        {loading&&<Loading height={'560px'}/>}
    </div>
  )
}
