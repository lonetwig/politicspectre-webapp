import React from 'react'
import styles from '../../styles/game/game.module.css'
import OfflineGame from '../../component/offlineGame/Game'


export default function index() {

  return (
    <>
      <div className={styles.full}>
          <OfflineGame/>
      </div>
    </>

  )
}
