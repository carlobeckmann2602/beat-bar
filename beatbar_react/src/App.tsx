import './App.css';
import DeveloperOptions from "./components/developerOptions";
import {useState} from "react";

export default function App() {
  const [showDeveloperOptions, setShowDeveloperOptions] = useState(false)
  return (
    <div className="app">
      <div className="top-line">
        <div className="mood-selector">mood: focused</div>
        <h1>beat.bar</h1>
        <ul className="control-options">
          <li>
            <span className="control-option-label">spacebar</span> play/pause
          </li>
          <li>
            <span className="control-option-label">arrows</span> change mood
          </li>
          <li>
            <span className="control-option-label">s</span> sad mood
          </li>
          <li>
            <span className="control-option-label">c</span> chill mood
          </li>
          <li>
            <span className="control-option-label">f</span> focused mood
          </li>
          <li>
            <span className="control-option-label">h</span> happy mood
          </li>
        </ul>
      </div>
      <div style={{visibility: showDeveloperOptions?'visible':'hidden'}}><DeveloperOptions /></div>
      <div className="bottom-line">
        <div className="developer-options-trigger" onClick={()=>{setShowDeveloperOptions(!showDeveloperOptions)}}>Developer Options</div>
        <div className="control-buttons">
          ply pre nxt vol
        </div>
        <div className="current-song">
          current playing: stormcloud - musicartis
        </div>
      </div>
    </div>
  )
}