import Head from 'next/head'
import BackGrid from '../component/BackGrid'
import styles from '../styles/home/Home.module.css'
import HomeCard from '../component/home/HomeCard'
import Kofi from '../component/Kofi'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>POLITICSPECTRE</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <meta name='author' content='lone twig'/> 
        {/* <link rel="shortcut icon" href="../public/favicon" /> */}
        <meta name='description' content='BEST PLACE TO CREATE POLITICAL SPECTRUMS. 
            Create your own political spectrums online alone or with your friends!'/>
        <meta name='keywords' content='politic, spectrum, compass, left, right ,authoritarian, libertarian, vote, president, party, democrat, republican, capitalism, communism, socialism, fascism, democracy, dictatorship, senate, bill,government, governor, election, usa'/>
      </Head>
      
      <Kofi/>

      <main className={styles.main}>
        <div className={styles.grid}>
          <BackGrid/>
        </div>
        <HomeCard/>
      </main>
    </div>
  )
}
