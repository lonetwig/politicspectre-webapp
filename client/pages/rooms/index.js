import React from 'react'
import BackGrid from '../../component/BackGrid'
import styles from '../../styles/rooms/rooms.module.css'
import RoomsCard from '../../component/rooms/roomsCard'
import Head from 'next/head'
import Kofi from '../../component/Kofi'

export default function index({data}) {
  return (
    <>
    <Kofi/>
    <Head>
      <title>Find Room - POLITICSPECTRE</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <meta name='author' content='lone twig'/> 
    </Head>
    <main className={styles.main}>
        <div className={styles.grid}>
            <BackGrid/>
        </div>
        <RoomsCard />
    </main> 
    </>

  )
}
