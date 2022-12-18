import React from 'react'
import styles from '../../styles/home/card.module.css'
import Image from 'next/image'
import Link from 'next/link'

export default function HomeCard() {
  return (
    <div className={styles.full}>
        <div className={styles.left}>
            <h1>BEST PLACE TO CREATE POLITICAL SPECTRUMS</h1>
            <h2> Create your own political spectrums online alone or with your friends!   
            </h2>
        </div>

        <div className={styles.right}>
                <div className={styles.buttons}>
                    <Link href='/rooms'><button>FIND ROOM</button></Link>
                    <Link href='/profile/create'><button>CREATE ROOM</button></Link>
                    <Link href='/rooms/offline'><button>OFFLINE ROOM</button></Link>
                </div>
                {/* <div className={styles.kofi}>
                    <a href='https://ko-fi.com/lonetwig' target={'_blank'}><div></div></a>
                    <Image src={require('../../public/kofi.png')} alt=''/>
                </div> */}
        </div>
    </div>
  )
}
