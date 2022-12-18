import {useState,useEffect,useContext} from 'react'
import styles from '../../../styles/profile/account.module.css'
import Edit from './Edit';
import Politic from './Politic';
import { FaHeart } from 'react-icons/fa';
import AddImage from '../../AddImage';
import { UserContext } from '../../context/userContext';
import { useRouter } from 'next/router';

export default function Account({user}) {
  const api=process.env.NEXT_PUBLIC_API
  const imgLink=process.env.NEXT_PUBLIC_IMG

  const [info,setInfo]=useState({
    displayImg:user.image?imgLink+user.image:'',
    oldImage:user.image?imgLink+user.image:'',
    sendImg:'',
    username:user.name, newUsername:user.username,usernameEdit:false,
    bio:user.bio?user.bio:'No bio yet.',newBio:user.bio?user.bio:'No bio yet.',bioEdit:false,hearts:user.hearts,accountName:user.username
  })
  const [ratio,setRatio]=useState('')
  const [politic,setPolitic]=useState({red:false,blue:false,grey:false,green:false,purple:false})
  const [permission,setPermission]=useState(false)
  const [error,setError]=useState('')
  const [succ,setSucc]=useState('')
  const {user:user2}=useContext(UserContext)
  const router=useRouter()

//info---------------------------------------------------

function changeVal(e){
  const {value,name}=e.target
  const size=e.target.files?e.target.files[0].size/1000:0
  if(size>2100){
      setError('Image Size must be Under 2MB')
      return
  }
  if(e.target.files && e.target.files[0]) {
      var reader = new FileReader();
      reader.onload = function(){
        setInfo({...info,displayImg:reader.result,sendImg:e.target.files[0]})
        setPermission(true)
      };
      reader.readAsDataURL(e.target.files[0]);
  }
  if(name!=='displayImg'){
      setInfo({...info,[name]:value})
  }
}

useEffect(()=>{
  setPolitic({red:false,blue:false,grey:false,green:false,purple:false,
      [user.politic]:true})
},[])

useEffect(()=>{
  if(succ)setSucc('')
},[info,politic])

useEffect(()=>{
  if(info.bioEdit||info.usernameEdit)setPermission(false)
},[info])

//change-edit---------------------------------------------

function changeEdit(edit,other){
  setInfo({...info,[edit]:true,[other]:false,newUsername:info.username,newBio:info.bio})
}

//submit-change---------------------------------------------

  function submitChange(){
    const{username,bio,sendImg,oldImage}=info
    const polArray=Object.keys(politic)
    const pol=polArray.find(p=>politic[p])
    
    const formData=new FormData()
    formData.append('image',sendImg)
    formData.append('username',username)
    formData.append('bio',bio)
    formData.append('politic',pol)
    formData.append('oldImage',oldImage)
    formData.append('ratio',ratio)
    if(username){
      fetch(api+'changeinfo',{
        method:'POST',
        headers:{
          Authorization:'Bearer '+user2
        },
        body:formData
      }).then(res=>res.json())
      .then(res=>{
        if(res.error){
          return setError(res.error)
        }
        setSucc('Account updated successfully!')
        setPermission(false)
      })
    }
    if(!username){
      setError('Invalid info')
    }
  }

//color---------------------------------------------------

const ccc=['red','blue','purple','green','grey']
let c
ccc.forEach(e=>{if(politic[e])c=`var(--${e})`})
const color={color:c}

//render---------------------------------------------------

  return (
    <div className={styles.full} style={color}>
      {error&&<div className={styles.error}>{error}</div>}
      {succ&&<div className={styles.succ}>{succ}</div>}
      <div className={styles.left}>
        <div className={styles.image}>
          <AddImage info={{displayImg:info.displayImg}} politic={politic} changeVal={changeVal} padding='20px' setRatio={setRatio}/>
          <div className={styles.heart}>
            <FaHeart size={30}/>
            <h1>{info.hearts}</h1>
          </div>
        </div>
        <div className={styles.username}>
          <h4 className={styles.accountName}>@{info.accountName}</h4>
          {!info.usernameEdit&&<label htmlFor='1' onClick={()=>changeEdit('usernameEdit','bioEdit')}>
            <h1>{info.username}</h1>
          </label>}
          {info.usernameEdit&&<input id='1' name='newUsername' value={info.newUsername} 
          onChange={(e)=>changeVal(e)} maxLength={15}/>}
          <Edit info={info} setInfo={setInfo} setPermission={setPermission}
          oldVal={'username'} newVal={'newUsername'} editVal={'usernameEdit'}
          other={'bio'} newOther={'newBio'} editOther={'bioEdit'} id='1'
          edit={info.usernameEdit}/>
        </div>

        <div className={styles.politic}>
          <Politic politic={politic} setPolitic={setPolitic} setPermission={setPermission}/>
        </div>
      </div>

      <div className={styles.right}>
          <div className={styles.bio}>
            <div><h1>BIO</h1>
              <div className={styles.bioEdit}>
                <Edit info={info} setInfo={setInfo} setPermission={setPermission}
                oldVal={'bio'} newVal={'newBio'} editVal={'bioEdit'}
                other={'username'} newOther={'newUsername'} editOther={'usernameEdit'} id='2' edit={info.bioEdit}/>
              </div>
            </div>
            {!info.bioEdit&&<div><label htmlFor='2'><p onClick={()=>changeEdit('bioEdit','usernameEdit')}>
              {info.bio}</p></label></div>}
            {info.bioEdit&&<textarea value={info.newBio} name='newBio' onChange={(e)=>changeVal(e)} id='2' maxLength={100}>{info.newBio}</textarea>}
            <h3>max 100 charachter</h3>
          </div>
        </div>
        <div className={styles.button}>
          {permission&&<button style={color} onClick={submitChange} className={styles.can}>UPDATE</button>}
          {!permission&&<button className={styles.cant}>UPDATE</button>}
        </div>
    </div>          

  )
}
