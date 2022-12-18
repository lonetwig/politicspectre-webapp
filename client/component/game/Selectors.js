import { useState,useEffect } from 'react'
import { AiOutlineSetting } from 'react-icons/ai';
import { TbBan } from 'react-icons/tb';
import { BiEraser,BiPencil } from 'react-icons/bi';
import { FiMousePointer } from 'react-icons/fi';
import { AiOutlineFileImage } from 'react-icons/ai';
import {colors} from '../../styles/theme'
import styles from '../../styles/game/left.module.css'
import html2canvas from 'html2canvas';

export default function Selectors({global}){
    const{mode,info,time,setMode,setAssetSize,setAdd,nop,setMaxSize,setSquare,setSelect,allPos,setAllPos,userInfo,setInfo,canvRef,setScreenshot}=global
    const[R,setR]=useState({Select:()=><div></div>,Add:()=><div></div>,Erase:()=><div></div>,Setting:()=><div></div>,Ban:()=><div></div>})

    function renitialise(){
        const newPose=allPos.map(p=>({...p,class:'grey'}))
        setAdd(false)
        setMaxSize({biggestX:-1,biggestY:-1,smallestX:nop+1,smallestY:nop+1})
        setSquare({_top:0,_right:0,_bottom:0,_left:0})
        setSelect(false)
        setAssetSize({_top:0,_right:0,_bottom:0,_left:0})
        setAllPos(newPose)
        setInfo({...info,squaresCount:0})
    }

    function changeMode(e,off){
        if(off==='on'){
            setMode(e)
        }
    }

    function render(){
        const Select=({color,off})=>(<div className={styles[off]} style={{color}} onClick={()=>changeMode('select',off)}><FiMousePointer size={30}/></div>)
        const Add=({color,off})=>(<div className={styles[off]} style={{color}} onClick={()=>changeMode('add',off)}><BiPencil size={34}/></div>)
        const Erase=({color,off})=>(<div className={styles[off]} style={{color}} onClick={()=>changeMode('erase',off)}><BiEraser size={34}/></div>)
        const Setting=({color,off})=>(<div className={styles[off]} style={{color}} onClick={()=>changeMode('setting',off)}><AiOutlineSetting size={34}/></div>)
        const Ban=({color,off})=>(<div className={styles[off]} style={{color}} onClick={()=>changeMode('ban',off)}><TbBan size={34}/></div>)
        setR({Select,Add,Erase,Setting,Ban})
    }

    useEffect(()=>{
        render()
        renitialise()
    },[mode])

    function getCanv(){
        html2canvas(canvRef.current,{useCORS: true}).then(function(canvas) {
            const image = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream')
            const a = document.createElement('a')
            a.setAttribute('download', 'politicspectre'+Date.now()+'.png')
            a.setAttribute('href', image)
            a.click()
        });
    }

  return (
    <div className={styles.options}>

        <div className={styles.on} onClick={getCanv}><AiOutlineFileImage color={colors.green} size={30}/></div>

                {userInfo.permission==='admin'&&<>
                    <R.Select color={mode==='select'?'orange':''} off={'on'}/>
                    {info.timer!==0&&<>
                    {time===0&&<R.Add color={mode==='add'?'orange':''} off={'on'}/>}
                    {time!==0&&<R.Add color={colors.grey} off={'off'}/>}
                    </>}
                    {!info.timer&&<R.Add color={mode==='add'?'orange':''} off={'on'}/>}
                    <R.Erase color={mode==='erase'?'orange':''} off={'on'}/>
                    <R.Setting color={mode==='setting'?'orange':''} off={'on'}/>
                    <R.Ban color={mode==='ban'?'orange':''} off={'on'}/>
                </>}
                
                {userInfo.permission==='stage'&&<>
                    <R.Select color={mode==='select'?'orange':''} off={'on'}/>
                    {time===0&&<R.Add color={mode==='add'?'orange':''} off={'on'}/>}
                    {time!==0&&<R.Add color={colors.grey} off={'off'}/>}
                    <R.Erase color={mode==='erase'?'orange':colors.grey} off={'off'}/>
                    <R.Setting color={mode==='setting'?'orange':colors.grey} off={'off'}/>
                    <R.Ban color={mode==='ban'?'orange':colors.grey} off={'off'}/>
                </>}
                {userInfo.permission==='watcher'&&<>
                    <R.Select color={mode==='select'?'orange':''} off={'on'}/>
                    <R.Add color={mode==='add'?'orange':colors.grey} off={'off'}/>
                    <R.Erase color={mode==='erase'?'orange':colors.grey} off={'off'}/>
                    <R.Setting color={mode==='setting'?'orange':colors.grey} off={'off'}/>
                    <R.Ban color={mode==='ban'?'orange':colors.grey} off={'off'}/>
                </>}
                <span style={{color:info.maxSquares>info.squaresCount?'var(--green)':'var(--red)'}}
                >Max Size {info.squaresCount}/{info.maxSquares}</span>
            </div>
  )
}
