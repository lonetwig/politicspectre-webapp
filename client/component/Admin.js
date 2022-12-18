import React, { useState } from 'react'

export default function Admin() {

    const [val,setVal]=useState({room:'',user:''})
    const [user,setUser]=useState({name:'',password:''})
    const api=process.env.NEXT_PUBLIC_API

    function changeUser(e){
        const{name,value}=e.target
        setUser(pre=>({...pre,[name]:value}))
    }

    function changeVal(e){
        const{name,value}=e.target
        setVal(pre=>({...pre,[name]:value}))
    }

    function banUser(){
        let formData=new FormData()
        formData.append('name',user.name)
        formData.append('password',user.password)
        formData.append('user',val.user)
        fetch(api+'adminbanuser',{
            method:'POST',
            body:formData
        })
    }

    function dltRoom(){
        let formData=new FormData()
        formData.append('name',user.name)
        formData.append('password',user.password)
        formData.append('room',val.room)
        fetch(api+'admindltroom',{
            method:'POST',
            body:formData
        })
    }

  return (
    <div style={{
        height:'100vh',display:'flex',justifyContent:'center',alignItems:'center',
        flexDirection:'column'
    }}>
        <input placeholder='name' type='password' name='name' value={user.name} onChange={(e)=>changeUser(e)}/>
        <input placeholder='password' type='password' name='password' value={user.password} onChange={(e)=>changeUser(e)}/>

        <input placeholder='user' name='user' value={val.user} onChange={(e)=>changeVal(e)}/>
        <button onClick={banUser}>ban user</button>
        <input placeholder='room' name='room' value={val.room} onChange={(e)=>changeVal(e)}/>
        <button onClick={dltRoom}>delete room</button>
    </div>
  )
}
