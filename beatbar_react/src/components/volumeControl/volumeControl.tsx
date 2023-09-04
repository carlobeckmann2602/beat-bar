import volumeMedium from "../../assets/icons/volume-medium.svg";
import React, {useState} from "react";
import styles from './volumeControl.module.css'
import VolumeBar from "./volumeBar";

export default function VolumeControl(){
  const [showVolumeBar, setShowVolumeBar] = useState(false)
  return(
    <div className={styles.volumeControl}>

      <VolumeBar showVolumeBar={showVolumeBar}/>
      <img onClick={()=>{setShowVolumeBar(!showVolumeBar)}} src={volumeMedium} alt={"volume icon to control the volume"} />
    </div>
  )
}