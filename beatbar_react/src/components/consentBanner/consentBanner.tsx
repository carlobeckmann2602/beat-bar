import styles from './styles.module.css'

type ConsentBannerProps = {
  setConsentGiven: Function
}

export default function ConsentBanner(props: ConsentBannerProps){
  return (
    <div className={styles.consentBannerBackground}>
      <div className={styles.consentBanner}>
        <h2 className={styles.consentBannerTitle}>Welcome to the beat.bar</h2>
        <p className={styles.consentBannerTitle}>
          The beat.bar is a study project. It has been developed in behalf of Hochschule Düsseldorf by Carlo Beckmann and Tobias Eckert for the course Musikinformatik in the SoSe 2023. This application and all its belongings, such as backend, are not (yet) meant to be published.
        </p>
        <p className={styles.consentBannerTitle}>
          This application needs to save some cookies to work properly. These cookie will fulfill the following purposes:
        </p>
        <p className={styles.consentBannerTitle}>
          We use an Unique User Identification (UUID) in form of a 16 digit number. This UUID will be used to identify the user against the Server to create and store personal playlists for the users settings.
        </p>
        <p className={styles.consentBannerTitle}>
          Furthermore we use a "Player State Cookie" to locally save the settings the user has made to his player during a session. When a user re-visits the beat.bar his player will be set as in his previous visit.
        </p>
        <p className={styles.consentBannerTitle}>
          Please accept that you read the paragraphs above by clicking the button below to continue to the beat.bar
        </p>
        <button onClick={()=>props.setConsentGiven(true)} className={styles.consentBannerButton}>Accept</button>
      </div>
    </div>
  )
}