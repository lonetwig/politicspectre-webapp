import React from 'react'
import styles from '../styles/loading.module.css'

export default function Loading({height,width}) {
  return (
    <div className={styles.all} style={{height:height,width:width}}>
        <div className={styles.ball+' '+styles.red}></div>
        <div className={styles.ball+' '+styles.blue}></div>
        <div className={styles.ball+' '+styles.green}></div>
        <div className={styles.ball+' '+styles.purple}></div>
    </div>
  )
}
