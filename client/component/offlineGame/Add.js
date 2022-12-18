import {useState,useContext, useEffect} from 'react'
import styles from '../../styles/game/add.module.css'
import { GiResize } from 'react-icons/gi';
import { BiRectangle as Md } from 'react-icons/bi';

export default function Add({global}){

  const{setAdd,assetSize,setAssetSize,setAssets,setGridError,squareRef,textCheck,setTextCheck,textRef,setEndSelect,endSelect,setUserInfo,userInfo,setMode,setTime,time,addAss}=global
  const [values,setValues]=useState({sendImg:'',displayImg:'',link:'',text:'',fit:'contain'})


//change val----------------------------------------------

  function changeVal(e){
    const {value,name}=e.target
    const size=e.target.files?e.target.files[0].size/1000:0
    if(size>2100){
        setGridError('Image Size must be Under 2MB')
        setValues({image:'',link:'',text:''})
        setAdd(false)
        return
    }
    if(e.target.files && e.target.files[0]){
        var reader = new FileReader();
        reader.onload = function(){
          setValues({...values,displayImg:reader.result,sendImg:e.target.files[0]})
        };
        reader.readAsDataURL(e.target.files[0]);
    }
    if(name!=='displayImg'){
      setValues({...values,[name]:value})
    }   
}

  function changeFit(e){
    setValues({...values,fit:e})
  }

  function cancel(){
    setValues({image:'',link:'',text:''})
    setAdd(false)
    setAssetSize({_top:0,_right:0,_bottom:0,_left:0})
    setEndSelect(!endSelect)
  }

//add asset----------------------------------------------

  function checkText(){
    setTextCheck([<h1 ref={textRef} key={1} style={{width:'100%',wordBreak:'break-all',fontSize:'3vh',opacity:0}}>{values.text}</h1>])
    let t=0
    let s=1
    if(textCheck[0]){
      s=squareRef.current.offsetHeight
      t=textRef.current.offsetHeight
    }
    return s>t
  }

useEffect(()=>{
  checkText()
},[values])


  function addAsset(type,content){
    if(!time){
      const checkT=checkText()
      setEndSelect(!endSelect)
      if(!checkT){
          setGridError('Text is too long for selection')
          setAdd(false)
          return
      }
      const{_top,_left,_right,_bottom}=assetSize
      let ass={type:type,
        content_id:Date.now(),
        _top,_left,_right,_bottom}
      let con=content==='displayImg'?values.displayImg:values[content]
      setAssets(pre=>[...pre,{...ass,content:con,fit:values.fit}])
      setAdd(false)
    }
  }


//render----------------------------------------------
  return (
    <div className={styles.full}>
      <div className={styles.mask} onClick={cancel}></div>
      <div className={styles.addContainer}>
        <div className={styles.image}>
          {(!values.displayImg&&!values.link)&&<label htmlFor='1'><div>Import image</div></label>}
          <input id='1' name='displayImg' type='file' onChange={(e)=>changeVal(e)}/>
          {values.displayImg&&<img style={{objectFit:values.fit}} src={values.displayImg}/>}
          {(values.link&&!values.displayImg)&&<img style={{objectFit:values.fit}} src={values.link}/>}
          {!values.displayImg&&<button className={styles.off}>IMPORT IMAGE</button>}
          {values.displayImg&&<button onClick={()=>addAsset('image','displayImg')} className={styles.active}>IMPORT IMAGE</button>}
          
          <div className={styles.fit}>
            {values.fit==='contain'&&<div className={styles.coverOn}><Md size={30}/></div>}
            {values.fit!=='contain'&&<div className={styles.coverOff} onClick={()=>changeFit('contain')}><Md size={30}/></div>}
            {values.fit==='fill'&&<div className={styles.fillOn}><GiResize size={30}/></div>}
            {values.fit!=='fill'&&<div className={styles.fillOff} onClick={()=>changeFit('fill')}><GiResize size={30}/></div>}
          </div>

        </div>

        <div className={styles.link}>
          <input name='link' placeholder='add image using link...' value={values.link} onChange={(e)=>changeVal(e)}/>
          {!values.link&&<button  className={styles.off}>ADD IMAGE USING LINK</button>}
          {values.link&&<button onClick={()=>addAsset('link','link')} className={styles.active}>ADD IMAGE USING LINK</button>}
        </div>

        <div className={styles.text}>
          <input name='text' placeholder='add text...' value={values.text} onChange={(e)=>changeVal(e)}/>
          {!values.text&&<button className={styles.off}>ADD TEXT</button>}
          {values.text&&<button onClick={()=>addAsset('text','text')} className={styles.active}>ADD TEXT</button>}
        </div>
      </div>
    </div>
  )
}
