import React from 'react'
import LoginCard from '../../component/login/loginCard'
import styles from '../../styles/signup/signup.module.css'
import BackGrid from '../../component/BackGrid'
import Head from 'next/head'
import Kofi from '../../component/Kofi'

export default function index() {
  return (
    <>
    <Head>
        <title>Log in - POLITICSPECTRE</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <meta name='author' content='lone twig'/> 
    </Head>
    <Kofi/>
      <main className={styles.main}>
        <div className={styles.grid}>
          <BackGrid/>
        </div>
        <LoginCard/>
      </main>
    </>
    )
}
