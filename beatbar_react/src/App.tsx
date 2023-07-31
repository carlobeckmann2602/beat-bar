import './App.css';
import DeveloperOptions from "./components/developerOptions";
import React, {useEffect, useState} from "react";
import * as Tone from 'tone'
import {Song} from "./types";

export default function App() {
  const [showDeveloperOptions, setShowDeveloperOptions] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false);
  const [player, setPlayer] = useState<Tone.Player>()
  const [currentSong, setCurrentSong] = useState<Song>()

  window.addEventListener("keyup", (event)=>{console.log(event)}, false);

  function handleSetCurrentSong(song: string){
    console.log(JSON.parse(song))
    setCurrentSong(JSON.parse(song))
  }

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
      <div style={{visibility: showDeveloperOptions?'visible':'hidden'}}>
        <DeveloperOptions
          player={player}
          setPlayer={setPlayer}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          currentSong={currentSong}
          setCurrentSong={handleSetCurrentSong}
        />
      </div>
      <div className="bottom-line">
        <div className="developer-options-trigger" onClick={()=>{setShowDeveloperOptions(!showDeveloperOptions)}}>Developer Options</div>
        <div className="control-buttons">
          ply pre nxt vol
        </div>
          <div className="current-song">
            {
              currentSong?
                `currently playing: ${currentSong.title} by ${currentSong.artist}`:
                "No song playing"
            }
          </div>
      </div>
    </div>
  )
}