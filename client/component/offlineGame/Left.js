import styles from '../../styles/game/left.module.css'
import Selectors from './Selectors';

export default function Left({global}) {

    const{info,love,mode,setMode,userInfo,setInfo,setAssetSize,setAdd,nop,setMaxSize,setSquare,setSelect,allPos,setAllPos,setTime,assets,time,clickAsset,canvRef,setScreenshot}=global

//assets------------------------------------------------------------

    const renderAssets=assets.map(a=>(
        <div key={a.content_id} className={styles.asset} onClick={()=>clickAsset(a)}>
            {a.type!=='text'&&<img src={a.content}/>}
            {a.type==='text'&&<div>{a.content[0].toUpperCase()}</div>}
        </div>
    ))


  return (
    <div className={styles.full}>
        <div className={styles.top}>
            <div className={styles.title}>
                <h1>Offline room</h1>
            </div>
        </div>

        <div className={styles.bottom}>
            <Selectors global={{setMode,setAssetSize,setAdd,nop,setMaxSize,setSquare,setSelect,allPos,setAllPos,userInfo,mode,info,time,setInfo,info,canvRef,setScreenshot}}/>
            <div className={styles.assets}>
                <div className={styles.top}>
                    <h1>Assets</h1>
                    <h1>{assets.length}/200</h1>
                </div>
                <div className={styles.assetImage}>
                    <div>{renderAssets}</div>
                </div>
            </div>
        </div>
    </div>
  )
}
