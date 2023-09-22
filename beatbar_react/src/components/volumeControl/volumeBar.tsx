import styles from './volumeControl.module.css'
import {useEffect, useState} from "react";
import volumeOffIcon from '../../assets/icons/volume-off.svg'

type VolumeBarProps = {
  setVolume: Function,
  showVolumeBar: boolean
}

export default function VolumeBar(props: VolumeBarProps){
  const [level, setLevel] = useState(7)
  const maxLevel = 7;

  useEffect(()=>{
    props.setVolume((level)/7)
  }, [level])

  function levelBars(){
    let bar = []
    for(let i=0;i<maxLevel;i++){
      bar.push(
        <div
          className={styles.levelBarTrigger}
          onClick={()=>{
            setLevel(i+1)
          }}
          onDragEnter={()=>{setLevel(i+1)}}
          key={i}
        >
          <div
            className={`${styles.levelBar} ${i>=level ? styles.inactive : ''}`}
          >
          </div>
        </div>

      )
    }
    return bar
  }

  return(
    <div
      className={`${styles.volumeSettings} ${!props.showVolumeBar ? styles.hidden : ''}`}
      onDragOver={(e)=>{e.preventDefault()}} >
      <img
        onClick={()=>{setLevel(0)}}
        className={`${styles.volumeOffIcon}`}
        src={volumeOffIcon}
        alt={'turn of the volume'} />
      <div className={styles.volumeBar}>
        {levelBars()}
      </div>
    </div>
  )
}