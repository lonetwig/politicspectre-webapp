import {useContext, useEffect, useState} from 'react'
import styles from '../../styles/profile/profileCard.module.css'
import Account from './account/Account'
import Rooms from './Rooms'
import Favs from './Favs'
import {UserContext} from '../context/userContext'
import { useRouter } from 'next/router'
import Loading from '../Loading'

export default function ProfileCard() {

  const [info,setInfo]=useState({rooms:[],favs:[],account:[]})
  const [loading,setLoading]=useState(true)
  const [option,setOption]=useState({account:false,rooms:true,favs:false})
  const {user,setUser}=useContext(UserContext)
  const router=useRouter()
  const api=process.env.NEXT_PUBLIC_API

  function getInfo(){
    if(user!=='notLogged'&&user!=='empty'){ 
      setLoading(true)
      fetch(api+'profile',{
      headers:{
        'Authorization': 'Bearer '+user
      }
      }).then(res=>res.json())
      .then(res=>{
        setInfo({rooms:res.rooms,favs:res.favs,account:res.user})
        setLoading(false)
      })
    }else{
      router.push('/login') 
    }
  }

  useEffect(()=>{
    if(user==='notLogged'){router.push('/login')}
    if(user!=='notLogged'&&user!=='empty'){getInfo()}
  },[user])

//optionColor----------------------------------------------------------------

  function changeOption(e){
    setOption({account:false,rooms:false,favs:false,[e]:true})
  }

  function styleCheck(e){
    if(!e){
      return({
        background:'hsl(265, 65%, 95%)',
        borderBottomColor:'var(--grey)'
      })
    }else{
      return({
        background:'white',
        borderBottomColor:'white'
      })
    }
  }

  if(user){
    return (
      <div className={styles.full}>
        <div className={styles.options}>

          <div onClick={()=>changeOption('account')} style={styleCheck(option.account)}>
            <h1>Account</h1>
          </div>
          
          <div onClick={()=>changeOption('rooms')} style={styleCheck(option.rooms)}>
            <h1>Rooms</h1>
          </div>

          <div onClick={()=>changeOption('favs')} style={styleCheck(option.favs)}>
            <h1>Favs</h1>
          </div>

        </div>
        {loading&&
            <div className={styles.section}>
              <Loading height={'480px'}/>
            </div>
        }
        {!loading&&
            <div className={styles.section}>
              {option.account&&<Account user={info.account} setUser={setInfo}/>}
              {option.rooms&&<Rooms info={info} setInfo={setInfo}/>}
              {option.favs&&<Favs info={info} setInfo={setInfo}/>}
            </div>
        }

      </div>
    )
  }
}
