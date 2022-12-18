import {useContext, useEffect, useState} from 'react'
import styles from '../../styles/rooms/roomsCard.module.css' 
import Room from './Room'
import Loading from '../Loading'
import { UserContext } from '../context/userContext'

export default function RoomsCard({title}) {

  const [option,setOption]=useState('newest')
  const [rooms,setRooms]=useState({popular:[],newest:[],random:[]})
  const [loading,setLoading]=useState(true)
  const{user}=useContext(UserContext)
  const api=process.env.NEXT_PUBLIC_API

  function changeOption(e){
    setOption(e)
  }

  function styleCheck(e){
    if(!e){
      return({
        background:'hsl(0, 65%, 95%)',
        borderBottomColor:'var(--grey)'
      })
    }else{
      return({
        background:'white',
        borderBottomColor:'white'
      })
    }
  }
  //getRooms----------------------------------------------------------

  useEffect(()=>{
    fetch(api+'getrooms')
    .then(res=>res.json())
    .then(res=>{
      setRooms(res)
      setLoading(false)
    })
  },[])

  const RoomsRender=rooms[option].map(dt=>(
    <Room 
    key={dt.room_id}
    room_id={dt.room_id}
    name={dt.room_name}
    img={dt.room_image?'http://localhost:8000/'+dt.room_image:''}
    heart={dt.hearts}
    user_in_room={dt.user_in_room}
    color={dt.room_politic}
    />
  ))

  return (
    <div className={styles.full}>
      <div className={styles.options}>

        <div onClick={()=>changeOption('popular')} style={styleCheck(option==='popular')}>
          <h1>Popular Rooms</h1>
        </div>
        
        <div onClick={()=>changeOption('newest')} style={styleCheck(option==='newest')}>
          <h1>Newest Rooms</h1>
        </div>

        <div onClick={()=>changeOption('random')} style={styleCheck(option==='random')}>
          <h1>Random Rooms</h1>
        </div>

      </div>
      <div className={styles.space}></div>
      <div className={styles.section} style={{gridTemplateColumns:loading?'1fr':''}}>
          {loading&&<Loading/>}
          {!loading&&<>{RoomsRender}</>}
      </div>
    </div>
  )
}
