import '../styles/globals.css'
import Header from '../component/Header'
import { useRouter } from 'next/router'
import User from '../component/context/userContext'
import Head from 'next/head'

function MyApp({ Component, pageProps }) {
  const router=useRouter()

  return(
    <>
      <Head>
            <link rel="shortcut icon" href="/image/favicon.png" />
            <link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png"/>
            <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png"/>
      </Head>
      <User>
        <Header/>
        <Component {...pageProps} />
      </User>
    </>

  )
}

export default MyApp
