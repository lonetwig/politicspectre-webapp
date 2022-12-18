import React, { useState,useContext,useEffect } from 'react'
import styles from '../styles/header/header.module.css'
import red from '../styles/header/red.module.css'
import blue from '../styles/header/blue.module.css'
import purple from '../styles/header/purple.module.css'
import Link from 'next/link'
import Search from './Search'
import { FaSearch } from 'react-icons/fa';
import {colors} from '../styles/theme'
import { GiHamburgerMenu } from 'react-icons/gi';
import { UserContext } from './context/userContext'
import { useRouter } from 'next/router'

export default function Header() {

  const [menu,setMenu]=useState(false)
  const {user,setUser}=useContext(UserContext)
  const router=useRouter()
  const[searching,setSearching]=useState(false)
  const[val,setVal]=useState('')
  const api=process.env.NEXT_PUBLIC_API

  function showBar(){
    setMenu(!menu)
  }

  useEffect(()=>{
    if(user!=='notLogged'&&user!=='empty'){
      fetch(api+'removeuser',{
        method:'POST',
        headers:{
          Authorization:'Bearer '+user
        }
      })
    }
  },[user])

//logout--------------------------------------------------

function logout(){
    fetch(api+'removeuserfromroom',{
      method:'POST',
      headers:{
        Authorization:'Bearer '+user
      }
    }).then(()=>{
  localStorage.removeItem('jwt')
      setUser('notLogged')
      router.replace('/login')
    })
}

//headerColor--------------------------------------------------

  const {pathname}=useRouter()
  function checkRoute(){
    if(pathname==='/signup'||pathname==='/login'){
      return {class:blue,color:'blue'}
    }else if(pathname==='/profile'||pathname==='/profile/create'){
      return {class:purple,color:'purple'}
    }else{
      return {class:red,color:'red'}
    }
  }

//linksRender--------------------------------------------------

  const Auths=()=>(
    <>
      <Link onClick={()=>setMenu(false)} href='/rooms'>
        <div>Find room</div>
      </Link>
      {user==='notLogged'&&<><Link onClick={()=>setMenu(false)} href='/login'>
        <div>Log in</div>
      </Link>
      <Link onClick={()=>setMenu(false)} href='/signup'>
        <div>Sign up</div>
      </Link></>}
      {(user!=='notLogged'&&user!=='empty')&&<><Link onClick={()=>setMenu(false)} href='/profile'>
        <div>Profile</div>
      </Link>
      <div onClick={logout}>Log out</div>
      </>}
    </>
  )

  //search------------------------------------------

  function changeVal(e){
    const{value}=e.target
    setVal(value)
  }

  return (
    <div className={checkRoute().class.colorCheck}>
      <div className={styles.full}>
          <div className={styles.logo}>
            <Link onClick={()=>setMenu(false)} href='/'>
              <h1>POLITICSPECTRE</h1>
            </Link>
          </div>

          <div className={styles.search} onFocus={()=>setSearching(true)} onBlur={()=>setTimeout(()=>setSearching(false),100)}>
            <div>
              <FaSearch size={28} 
              color={colors[checkRoute().color]}/>
            </div>
            <input placeholder='' onChange={(e)=>changeVal(e)} value={val}/>
            {searching&&<div className={styles.result} onMouseOver={()=>setSearching(true)}><Search global={{searching,setSearching,val,setVal}}/></div>}
          </div>

          <div className={styles.mobAuths}>
            <button onClick={showBar}>
              <GiHamburgerMenu size={38} 
              color={colors[checkRoute().color]}/></button>
          </div>

          <div className={styles.auths}>
            <Auths/>
          </div>
      </div>

      {menu&&<div className={styles.menu}>
          <Link onClick={()=>setMenu(false)} href='/'><h1>POLITICSPECTRE</h1></Link>
          <Auths/>
          <a target='_blank' onClick={()=>setMenu(false)} href='https://ko-fi.com/lonetwig'>
            <div>Support me</div>
          </a>
        </div>}
    </div>
    
  )
}
