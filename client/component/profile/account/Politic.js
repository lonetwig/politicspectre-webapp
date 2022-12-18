import React from 'react'
import styles from '../../../styles/profile/politic.module.css'

export default function Politic({politic,setPolitic,setPermission}) {
  
  function changePol(e){
    setPolitic({red:false,blue:false,grey:false,green:false,purple:false,[e]:true})
    if(setPermission){setPermission(true)}
  }

  function getColor(e){
    if(politic[e]){
      return{
        border:'4px solid white',
        opacity:'1'
      }
    }
      return{border:'4px solid white',mixBlendMode:'luminosity'
    }
  }
  return (
    <div>
        <div className={styles.politic}>
            <div className={styles.red} onClick={()=>changePol('red')} style={getColor('red')}></div>
            <div className={styles.blue} onClick={()=>changePol('blue')} style={getColor('blue')}></div>
            <div className={styles.grey} onClick={()=>changePol('grey')} style={getColor('grey')}></div>
            <div className={styles.green} onClick={()=>changePol('green')} style={getColor('green')}></div>
            <div className={styles.purple} onClick={()=>changePol('purple')} style={getColor('purple')}></div>
        </div>
    </div>
  )
}
