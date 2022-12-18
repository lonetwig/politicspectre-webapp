import React from 'react'
import styles from '../styles/kofi.module.css'
import Image from 'next/image'

export default function Kofi(){
  return (
    <div className={styles.full}>
        <div className={styles.kofi}>
            <a href='https://ko-fi.com/lonetwig' target={'_blank'}><div></div></a>
            <Image src={require('../public/kofi.png')} alt=''/>
        </div>
    </div>
  )
}
