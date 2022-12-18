import React from 'react'
import styles from '../../../styles/game/game.module.css'
import Game from '../../../component/game/Game'
import Head from 'next/head'


export default function index({data}) {

  return (
    <>
      <div className={styles.full}>
          <Game/>
      </div>
    </>

  )
}


// export async function getStaticProps({params}){
//   const res=await fetch('http://localhost:8000/getroomname',{
//     method:'POST',
//     headers:{
//       'Accept': 'application/json',
//       'Content-Type': 'application/json'
//     },
//     body:JSON.stringify({room_id:params.room})
//   })
//   const data=await res.json()
//   return{
//     props:{
//       data
//     }
//   }
// }

// export async function getStaticPaths(){
//   return{
//     paths:[{params:{'room':'128'}}],
//     fallback:true
//   }
// }