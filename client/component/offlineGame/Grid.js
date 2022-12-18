import { useRouter } from 'next/router'
import { useEffect, useState, useContext } from 'react'
import styles from '../../styles/game/grid.module.css'
import { colors } from '../../styles/theme'
import { UserContext } from '../context/userContext'

export default function Grid({global}){
  const {
    assets,setAdd,info,setInfo,mode,setAssetSize,gridError,maxSize,setMaxSize,select,setSelect,allPos,setAllPos,square,setSquare,nop,ps,squareRef,textCheck,endSelect,canvRef,setAssets
  }=global
  const[assetsRender,setAssetsRender]=useState([])


//determin pos--------------------------------------------

  function determinPos(color){
    const x=[]
    const y=[]
    for(let i=0;i<nop;i++){
      x.push(i)
      y.push(i)
    }
    let pos=[]
    let i=0
      y.forEach(eley=>{
        x.forEach(elex=>{
          if(elex>=nop/2&&eley<nop/2){
            pos.push({x:elex,y:eley,class:color,color:colors.blue,id:i})
          }
          if(elex<nop/2&&eley<nop/2){
            pos.push({x:elex,y:eley,class:color,color:colors.red,id:i})
          }
          if(elex>=nop/2&&eley>=nop/2){
            pos.push({x:elex,y:eley,class:color,color:colors.purple,id:i})
          }
          if(elex<nop/2&&eley>=nop/2){
            pos.push({x:elex,y:eley,class:color,color:colors.green,id:i})
          }
          i++
        })
      })
      setAllPos(pos)
  }

  useEffect(()=>{
      determinPos('grey')
  },[])  

//setSize--------------------------------------------

function checkSize(enterPos,x,y){
  let{biggestX,biggestY,smallestX,smallestY}=maxSize
  if(select){
    enterPos.forEach(p=>{
      if(biggestX==-1&&biggestY==-1&&smallestX==nop+1&&smallestY==nop+1){
        setMaxSize({biggestX:x,biggestY:y,smallestX:x,smallestY:y})
        return null
      }
      if(p.x>biggestX&&p.class==='yellow'){
        setMaxSize({...maxSize,biggestX:p.x})
      }
      if(p.y>biggestY&&p.class==='yellow'){
        setMaxSize({...maxSize,biggestY:p.y})
      }
      if(p.x<smallestX&&p.class==='yellow'){
        setMaxSize({...maxSize,smallestX:p.x})
      }
      if(p.y<smallestY&&p.class==='yellow'){
        setMaxSize({...maxSize,smallestY:p.y})
      }
    })
  }
}

//----------------------------------------------

  function checkPos(oldPos,x,y){
    let toChange=oldPos.find(pos=>pos.x===parseInt(x)&&pos.y===parseInt(y))
    let toChange2={...toChange,class:'yellow',check:false}
    let newAllPos=oldPos
    newAllPos.splice(allPos.indexOf(toChange),1,toChange2)
    return newAllPos
  }

//hover pos-----------------------------------------

function selectingPos(e){
  const {id}=e.target
  if(select){
    const [x,y,cls]=id.split(',')
    let finalPos=[]
      checkSize(allPos,x,y)
      finalPos=checkPos(allPos,x,y)
      setAllPos([...finalPos]) 
  }
}

//square--------------------------------------

function changeSquare(){
  let{biggestX,biggestY,smallestX,smallestY}=maxSize
  if(biggestX!==-1&&biggestY!==-1&&smallestX!==nop+1&&smallestY!==nop+1){
    setSquare({
      _top:smallestY*ps+'%',
      _right:(nop-biggestX-1)*ps+'%',
      _bottom:(nop-biggestY-1)*ps+'%',
      _left:smallestX*ps+'%'
    })
  }
}

useEffect(()=>{
  changeSquare()
},[maxSize])

//right click--------------------------------------

function removeSelection(e){
  if(e){e.preventDefault()} 
    setSelect(false)
    setSquare({_top:0,_right:0,_bottom:0,_left:0})
    determinPos('grey')
    setInfo({...info,squaresCount:0})
    setMaxSize({biggestX:-1,biggestY:-1,smallestX:nop+1,smallestY:nop+1})
}

//click pos--------------------------------------


function changeSelect(e){
  if(mode==='add'){
    let{biggestX,biggestY,smallestX,smallestY}=maxSize
    let check=false
    if(!select){
      setAssetSize({_top:0,_right:0,_bottom:0,_left:0})
      setSelect(true)
      selectingPos(e)
    }
    if(biggestX!==-1&&biggestY!==-1&&smallestX!==nop+1&&smallestY!==nop+1&&info.squaresCount<info.maxSquares){
      check=true
    }
    if(select&&check){
      setAdd(true)
      setSelect(false)
      setAssetSize({...square})
    }
  }
}

useEffect(()=>{
    removeSelection()
},[endSelect])

// styles----------------------------------------------

  const{_top,_right,_bottom,_left}=square
  const {biggestX,biggestY,smallestX,smallestY}=maxSize
  const touch=mode!=='add'?'all':'none'
  const showBorder=info.squaresCount>10?'.1s':'0s'
  const squareStyle={
    padding:_top+' '+_right+' '+_bottom+' '+_left,
    pointerEvents:touch,transition:showBorder
  }
  const borderColor=info.squaresCount>info.maxSquares?'red':'green'
  const squareBorder={
    borderColor:!_top&&!_right&&!_bottom&&!_left?'rgba(0,0,0,0)':borderColor,
  }

  function setCount(){
    if(biggestX!==-1||biggestY!==-1||smallestX!==nop+1||smallestY!==nop+1){
      setInfo({...info,squaresCount:(biggestX-smallestX+1)*(biggestY-smallestY+1)})
    }
  }
  useEffect(()=>{setCount()},[maxSize])

  let cursor=mode==='select'?'default':''
  cursor=mode==='erase'?'cell':cursor
  cursor=mode==='add'?'crosshair':cursor

//grid render---------------------------------------------

const render=allPos.map(p=>(<div 
  key={p.id} 
  id={p.x+','+p.y+','+p.class}
  className={styles.pos}
  onClick={(e)=>changeSelect(e)}
  onMouseMove={(e)=>selectingPos(e)}
  >
      <div 
      className={styles.posInside+' '+styles[p.class]}
      style={{background:p.x<=biggestX&&p.x>=smallestX&&p.y<=biggestY&&p.y>=smallestY?'white':p.color}}
      ></div>
  </div>)
  )

//assets render---------------------------------------------

function clickAsset(e){
  const newAss=assets.filter(ass=>ass.content_id!==e.content_id)
  setAssets(newAss)
}

useEffect(()=>{
  let ar
  ar=assets.map(a=>{
    if(a.type==='image'||a.type==='link'){
      return(
        <div key={a.content_id} style={{padding:`${a._top} ${a._right} ${a._bottom} ${a._left}`,pointerEvents:touch,cursor:cursor==='default'?'pointer':''}} className={styles.assetsContainer} onClick={()=>clickAsset(a,()=>null)}>
          <div className={styles.asset}>
            <img style={{objectFit:a.fit}} src={a.content}/>
            <div className={styles.mask}></div>
          </div>
        </div>)}

    if(a.type==='text'){
      function textBorder(){
        const comb=[0,1,-1,2,-2]
        let textBorder=''
        for(let i=0;i<comb.length;i++){
          comb.forEach(comb1=>{
            textBorder+=comb[i]+'px '+comb1+'px grey,'
          })
        }
        return textBorder.substring(0,textBorder.length-1)
      }
      return(
        <div key={a.content_id} style={{padding:`${a._top} ${a._right} ${a._bottom} ${a._left}`,display:'flex',alignItems:'center',justifyContent:'center',pointerEvents:touch,cursor:cursor==='default'?'pointer':''}} className={styles.assetsContainer} onClick={()=>clickAsset(a,()=>null)}>
          <div className={styles.text}>
            <h1 style={{textShadow:textBorder()}}>{a.content}</h1>
            <div className={styles.mask}></div>
          </div>
        </div>)}
  })
  setAssetsRender(ar)
},[assets,mode])

// render----------------------------------------------
  return (
    <div className={styles.full} style={{cursor:cursor}} ref={canvRef}>

      <div className={styles.grid} onContextMenu={(e)=>removeSelection(e)}>
        {render}
      </div>


      <div className={styles.squareContainer} style={squareStyle}>
        <div className={styles.square} style={squareBorder} ref={squareRef}>
          {textCheck}
        </div>
      </div>
      {gridError&&<div className={styles.gridError}>{gridError}</div>}
      {assetsRender}

    </div>
  );
}
