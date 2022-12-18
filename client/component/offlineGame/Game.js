import {useState,useEffect, useContext,useRef} from 'react'
import styles from '../../styles/game/gameCard.module.css'
import Grid from './Grid'
import Add from './Add'
import Left from './Left'
import Right from './Right'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function game() {

  const [info,setInfo]=useState({squaresCount:0,maxSquares:1601,loved:false,permission:'',name:'',privacy:'',owner:'',user_in_room:'',hearts:'',chat:[],admin:[],stage:[],watcher:[],bans:[],timer:false})
  const [assets,setAssets]=useState([])
  const [assetSize,setAssetSize]=useState({_top:0,_right:0,_bottom:0,_left:0})
  const [add,setAdd]=useState(false)
  const [userInfo,setUserInfo]=useState({permission:'watcher',last_post_time:0,last_timer:0})
  const [mode,setMode]=useState('add')
  const [loading,setLoading]=useState({})
  const [square,setSquare]=useState({_top:0,_right:0,_bottom:0,_left:0})
  const [allPos,setAllPos]=useState([])
  const [select,setSelect]=useState(false)
  const nop=40
  const ps=100/nop
  const [maxSize,setMaxSize]=useState({biggestX:-1,biggestY:-1,smallestX:nop+1,smallestY:nop+1})
  const router=useRouter()
  const [gridError,setGridError]=useState(false)
  const [textCheck,setTextCheck]=useState([])
  const squareRef=useRef()
  const textRef=useRef()
  const [endSelect,setEndSelect]=useState(false)
  const [time,setTime]=useState(0)
  const [screenShot,setScreenShot]=useState(false)
  const canvRef=useRef()

  function changeAdd(){
    setAdd(false)
  }


//loading--------------------------------------------------------------

return (
    <div className={styles.full}>
      <Head>
        <title>Offline room - POLITICSPECTRE</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <meta name='author' content='lone twig'/> 
      </Head>
      
      <>
        <div className={styles.left}><Left global={{info,mode,setMode,userInfo,setAssetSize,setAdd,nop,setMaxSize,setSquare,setSelect,allPos,setAllPos,setUserInfo,time,setTime,assets,setInfo,canvRef,setScreenShot}}/></div>
        
        <div className={styles.mid}>
          <Grid global={{assets,setAdd,info,setInfo,mode,setAssetSize,gridError,maxSize,setMaxSize,select,setSelect,allPos,setAllPos,square,setSquare,nop,ps,squareRef,textCheck,setTextCheck,add,endSelect,userInfo,canvRef,setAssets}}/>
        </div>

        <div className={styles.right}><Right global={{info,setInfo,userInfo,setLoading}}/></div>

        {add&&<div>
          <div className={styles.addContainer} onClick={changeAdd}></div>
          <div className={styles.add}><Add global={{setAdd,assetSize,setAssets,setAssetSize,gridError,setGridError,squareRef,textCheck,setTextCheck,textRef,setEndSelect,endSelect,setUserInfo,userInfo,setMode,setTime,time}}/></div>
        </div>}

      </>

    </div>
  )
}
