import { useRouter } from 'next/router'
import {useState,useContext, useEffect} from 'react'
import styles from '../../styles/game/add.module.css'
import { UserContext } from '../context/userContext'
import { GiResize } from 'react-icons/gi';
import { BiRectangle as Md } from 'react-icons/bi';

export default function Add({global}){

  const{setAdd,assetSize,setAssetSize,setAssets,setGridError,squareRef,textCheck,setTextCheck,textRef,setEndSelect,endSelect,setUserInfo,userInfo,setMode,setTime,time,addAss}=global
  const [values,setValues]=useState({sendImg:'',displayImg:'',link:'',text:'',fit:'contain'})
  const {user}=useContext(UserContext)
  const router=useRouter()
  const room_id=router.query.r
  const api=process.env.NEXT_PUBLIC_API
  const imgLink=process.env.NEXT_PUBLIC_IMG

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
      let con=content==='displayImg'?values.sendImg:values[content]
      sendAsset(ass,con).then((res)=>{
        setValues({sendImg:'',displayImg:'',link:'',text:''})
        if(res.error){
          setAdd(false)
          return setGridError(res.error)
        }
        if(res.timer!==0){
          setUserInfo(pre=>({...pre,last_post_time:parseInt(Date.now()/1000),last_timer:res.timer}))
          setMode('select')
          setTime(res.timer)
        }
        const{user_id,image,politic,name,username}=userInfo
        const con=type!=='image'?res.sendImg:imgLink+res.sendImg
        addAss({...ass,content:con,fit:values.fit,user_id,image,politic,name,username})
        setAssets(pre=>[...pre,{...ass,content:con,fit:values.fit,user_id,image,politic,name,username}])
        setAdd(false)
      })
    }else{
      setAdd(false)
      setMode('select')
      setGridError("You can't post now.")
      setAssetSize({_top:0,_right:0,_bottom:0,_left:0})
      setEndSelect(!endSelect)
    }
  }

  function sendAsset(asset,con){
    if(user!=='notLogged'&&user!=='empty'){
      const formData=new FormData()
      formData.append('room_id',room_id)
      formData.append('asset',JSON.stringify(asset))
      formData.append('image',con)
      formData.append('fit',values.fit)
      formData.append('post_time',parseInt(Date.now()/1000))
      return fetch(api+'addasset',{
        method:'POST',
        headers:{
          Authorization:'Bearer '+user
        },body:formData
      }).then(res=>res.json())
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
