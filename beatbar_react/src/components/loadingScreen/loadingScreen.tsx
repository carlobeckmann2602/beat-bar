import './style.css'

export default function LoadingScreen(){
  return(
    <div className="loading-spinner-background">
      <h1>beat.bar is loading a new playlist for you</h1>
      <div className="lds-facebook">
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>
    </div>
  )
}