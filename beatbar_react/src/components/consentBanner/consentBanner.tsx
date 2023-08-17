import styles from './styles.module.css'

type ConsentBannerProps = {
  setConsentGiven: Function
}

export default function ConsentBanner(props: ConsentBannerProps){
  return (
    <div className={styles.consentBannerBackground}>
      <div className={styles.consentBanner}>
        <h2>Welcome to the beat.bar</h2>
        <p>
          This application needs to save some cookies to work properly. These cookie will fulfill the following purposes:
        </p>
        <p>
          We use an Unique User Identification (UUID) in form of a 16 digit number. This UUID will be used to identify the user against the Server to create and store personal playlists for the users settings.
        </p>
        <p>
          Furthermore we use a "Player State Cookie" to locally save the settings the user has made to his player during a session. When a user re-visits the beat.bar his player will be set as in his previous visit.
        </p>
        <p>
          Please accept the usage of this technically required cookies by clicking the button below to continue to the beat.bar
        </p>
        <button onClick={()=>props.setConsentGiven(true)} className={styles.consentBannerButton}>Accept</button>
      </div>
    </div>
  )
}