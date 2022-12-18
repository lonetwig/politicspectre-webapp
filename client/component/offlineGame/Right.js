import styles from '../../styles/game/right.module.css'

export default function Right({global}){

//render-----------------------------------------------------------------

  return (
    <div className={styles.full}>
        <div style={{opacity:'.3'}}>
        <h1 style={{fontSize:'2rem'}}>This is an offline room</h1>
        <h2 style={{fontSize:'1.4rem'}}>all informations will be lost when you close the room.</h2>
        </div>
    </div>
  )
}
