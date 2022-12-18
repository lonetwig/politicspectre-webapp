import {useEffect, useRef} from 'react'
import styles from '../styles/addImage.module.css'
import { colors } from '../styles/theme'

export default function AddImage({politic,info,setRatio,changeVal,padding}) {

  const imgRef=useRef()

  function color(){
    const ccc=['red','blue','grey','green','purple']
    const x=ccc.find(clr=>politic[clr])
    return {background:colors[x],padding:padding}
  }

  useEffect(()=>{
    const {naturalWidth,naturalHeight}=imgRef.current?imgRef.current:{naturalWidth:null,naturalHeight:null}
    setRatio(naturalWidth/naturalHeight)
  },[info.displayImg])



  return (
    <div className={styles.full}>
        <label htmlFor='4' className={styles.imgInp}>
            <div className={styles.img} style={color()}>
                {info.displayImg&&<img src={info.displayImg} ref={imgRef}/>}
            </div>
            {!info.displayImg&&<div className={styles.imgTxt}>insert image</div>}
            <span></span>
        </label>
        <input type='file' id='4' onChange={(e)=>changeVal(e)} name='displayImg'
        accept="image/jpeg, image/png"/>
    </div>
  )
}
