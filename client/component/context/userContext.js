import {useState,createContext, useEffect} from 'react'

export const UserContext=createContext(null)

export default function User({children}){

    const [user,setUser]=useState('empty')
    const token=typeof(window)!=='undefined'?JSON.parse(localStorage.getItem('jwt')):''
    const jwt=token?token:'notLogged'
    useEffect(()=>{
      setUser(jwt)
    },[token])

  return (
    <UserContext.Provider value={{user,setUser}}>
        {children}
    </UserContext.Provider>
  )
}
