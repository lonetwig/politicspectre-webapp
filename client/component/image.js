import React from 'react'
import styles from '../styles/addImage.module.css'
import { colors } from '../styles/theme'

export default function AddImage({politic,info,padding}) {

  function color(){
    const ccc=['red','blue','grey','green','purple']
    const x=ccc.find(clr=>politic[clr])
    return {background:colors[x],padding:padding}
  }

  return (
    <div className={styles.full}>
        <label htmlFor='4' className={styles.imgInp}>
            <div className={styles.img} style={color()}>
                {info.image&&<img src={info.image}/>}
            </div>
        </label>
    </div>
  )
}
