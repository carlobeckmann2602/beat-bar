import backgroundFocused01 from "../../assets/images/background-focused-01.jpg"
import backgroundFocused02 from "../../assets/images/background-focused-02.jpg"
import backgroundFocused03 from "../../assets/images/background-focused-03.jpg"
import backgroundSad01 from "../../assets/images/background-sad-01.jpg"
import backgroundSad02 from "../../assets/images/background-sad-02.jpg"
import backgroundSad03 from "../../assets/images/background-sad-03.jpg"
import backgroundHappy01 from "../../assets/images/background-happy-01.jpg"
import backgroundHappy02 from "../../assets/images/background-happy-02.jpg"
import backgroundHappy03 from "../../assets/images/background-happy-03.jpg"
import backgroundChill01 from "../../assets/images/background-chill-01.jpg"
import backgroundChill02 from "../../assets/images/background-chill-02.jpg"
import backgroundChill03 from "../../assets/images/background-chill-03.jpg"
import backgroundChill04 from "../../assets/images/background-chill-04.jpg"
import styles from './styles.module.css'
import {useEffect, useState} from "react";

export default function Background(){
  const backgroundsCollection = [
    backgroundFocused01,
    backgroundFocused02,
    backgroundFocused03,
    backgroundSad01,
    backgroundSad02,
    backgroundSad03,
    backgroundHappy01,
    backgroundHappy02,
    backgroundHappy03,
    backgroundChill01,
    backgroundChill02,
    backgroundChill03,
    backgroundChill04
  ]

  const [currentImage, setCurrentImage] = useState<string>();
  const [fadeIn, setFadeIn] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)

  const imageDuration = 14000;

  useEffect(()=>{
    setCurrentImage(backgroundsCollection[Math.floor(Math.random() * backgroundsCollection.length)])
  }, [])

  useEffect(()=>{
    const interval = setInterval(() => {
      setFadeOut(true)
      setTimeout(()=>{
        setCurrentImage(backgroundsCollection[Math.floor(Math.random() * backgroundsCollection.length)])
        setFadeOut(false)
        setFadeIn(true)
        setTimeout(()=>{
          setFadeIn(false)
        }, 2000)
      },2000)
    }, imageDuration);
    return () => clearInterval(interval);
  }, [])


  return (
    <div className={styles.background}>
      <img
        className={`
          ${styles.backgroundImage}
          ${fadeOut?styles.fadeOut:''}
          ${fadeIn?styles.fadeIn:''}
        `}
        src={currentImage}
        alt={"Background image for beat dot bar"}
      />
    </div>
  )
}