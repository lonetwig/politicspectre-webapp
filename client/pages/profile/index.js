import React from 'react'
import styles from '../../styles/profile/profile.module.css'
import BackGrid from '../../component/BackGrid'
import ProfileCard from '../../component/profile/profileCard'
import Head from 'next/head'
import Kofi from '../../component/Kofi'

export default function index() {

  return (
    <>
    <Head>
      <title>Profile - POLITICSPECTRE</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <meta name='author' content='lone twig'/> 
    </Head>
    <Kofi/>
    <main className={styles.main}>
      <div className={styles.grid}>
        <BackGrid/>
      </div>
      <ProfileCard/>
    </main> 
    </>
 )
}
