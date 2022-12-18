import React from 'react'
import styles from '../../../styles/profile/edit.module.css'
import { BiCheck,BiX } from 'react-icons/bi';
import { FaPen } from 'react-icons/fa';
import {colors} from '../../../styles/theme'

export default function Edit(
  {oldVal,newVal,editVal,other,newOther,editOther,info,setInfo,setPermission,edit}) {

  function agree(){
    if(info[oldVal]!==info[newVal]){
      setPermission(true)
    }
    if(info.newUsername){
      setInfo({...info,[oldVal]:info[newVal],[editVal]:false})
    }
    if(!info.newUsername){
      setInfo({...info,[newVal]:info[oldVal],[editVal]:false})
    }
  }

  function disagree(){
    setInfo({...info,[editVal]:false,[newVal]:info[oldVal]})
  }

  function editFunc(){
    setInfo({...info,[newOther]:info[other],[editOther]:false,[editVal]:true})
  }

  return (
    <div>
        <div className={styles.edit2} style={{left:info.bioEdit&&!info.usernameEdit?'-30px':''}}>
            {edit&&<>
                <div className={styles.check} onClick={agree}><BiCheck color={colors.green} size={32}/></div>
                <div className={styles.x} onClick={disagree}><BiX color={colors.red} 
                size={32}/></div>
            </>}
            </div>
            <div className={styles.edit}>
            {!edit&&<>
                <div className={styles.pen} onClick={editFunc}><FaPen color={colors.purple} size={20}/></div>
            </>}
        </div>
    </div>
  )
}
