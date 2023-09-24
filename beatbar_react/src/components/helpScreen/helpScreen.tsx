import styles from './styles.module.css'

type helpScreenProps = {
  setShowHelp: Function
}

export default function HelpScreen(props: helpScreenProps){
  return (
    <div className={styles.helpScreenBackground}>
      <div className={styles.helpScreen}>
        <h2 className={styles.helpScreenTitle}>Instructions beat.bar</h2>
        <p>1. Select a Mood to load a playlist</p>
        <p>2. Wait for Beat.bar to create and load a playlist</p>
        <p>3. Press play to start the infinite loop</p>
        <p>4. If you dont like a song you can skip it or stop it to restart it</p>
        <button onClick={()=>props.setShowHelp(false)} className={styles.helpScreenButton}>Close</button>
      </div>
    </div>
  )
}