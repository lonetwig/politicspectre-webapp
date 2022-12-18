import React from 'react'
import styles from '../styles/backGrid/backGrid.module.css'
import purple from '../styles/backGrid/purple.module.css'
import green from '../styles/backGrid/green.module.css'
import yellow from '../styles/backGrid/yellow.module.css'
import { useRouter } from 'next/router'

export default function BackGrid(){
  const {pathname}=useRouter()
  function checkRoute(){
    if(pathname==='/signup'||pathname==='/login'){
      return green
    }else if(pathname==='/'||pathname==='/rooms'){
      return purple
    }else{
      return yellow
    }
  }
  return (
    <div className={checkRoute().color}>
      <div className={styles.full}>
        <div className={styles.grid}>BackGrid</div>
      </div>
    </div>
  )
}
