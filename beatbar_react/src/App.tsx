import "./App.css";
import DeveloperOptions from "./components/developerOptions";
import React, {useEffect, useState} from "react";
import * as Tone from "tone";
import {AllSongsUrls, BeatbarPlayerError, MOODS, Song} from "./commons/types";
import {ALL_SONGS} from "./commons/commons";
import Background from "./components/background/background";
import {setMood} from './components/backendController'

import playIcon from '../src/assets/icons/play.svg'
import pauseIcon from '../src/assets/icons/pause.svg'
import skipIcon from '../src/assets/icons/skip.svg'
import previousIcon from '../src/assets/icons/previous.svg'
import MoodSelector from "./components/moodSelector/moodSelector";
import ConsentBanner from "./components/consentBanner/consentBanner";
import Cookies from 'universal-cookie';
import VolumeControl from "./components/volumeControl/volumeControl";
import {getSong} from "./components/playlistController";
import {checkConsentCookie, checkStateCookie} from "./components/cookieController";
import {formatTimeStamp} from "./components/helper/format";
import {GrainPlayer} from "tone";
import {adjustPitchValue, adjustSpeedValue} from "./components/modulationController";

export default function App() {
  const [showDeveloperOptions, setShowDeveloperOptions] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [player, setPlayer] = useState<Tone.GrainPlayer>();
  const [currentSong, setCurrentSong] = useState<Song>();
  const [nextSong, setNextSong] = useState<Song>();
  const [currentPlaylistId, setCurrentPlaylistId] = useState(1)

  const [selectedMood, setSelectedMood] = useState<MOODS>(MOODS.focused)

  const [nodesInitialized, setNodesInitialized] = useState(false);
  const [volume, setVolume] = useState<number>(50);
  const [panorama, setPanorama] = useState<number>(0);
  const [speedValue, setSpeedValue] = useState<number>(1);
  const [pitchNode, setPitchNode] = useState<Tone.PitchShift>();
  const [pitchValue, setPitchValue] = useState<number>(0);
  const [songIsPlaying, setSongIsPlaying] = useState(false)

  const [consentGiven, setConsentGiven] = useState<boolean>()
  const [uuid, setUuid] = useState<string>()
  const [error, setError] = useState<(BeatbarPlayerError | undefined)>(undefined)

  const [songsInitiallySet, setSongsInitiallySet] = useState(false)

  const [timerTime, setTimerTime] = useState(0)
  const [timerRunning, setTimerRunning] = useState(false)
  const [crossFadeTime, setCrossFadeTime] = useState(15);
  const [crossFadeDone, setCrossFadeDone] = useState(false)

  let bodyElement: HTMLElement | null;

  /**
   * Keyboard Handler
   * @param event
   */
  function keyboardHandler(event: KeyboardEvent){
    if (event.code === 'Space'){
      event.preventDefault()
      console.log("isPlaying: ", isPlaying)
      isPlaying?
        pause():
        play()
    }
    if (event.code === 'KeyS'){
      console.log("sad mood")
    }
    if (event.code === 'KeyC'){
      console.log("chill mood")
    }
    if (event.code === 'KeyF'){
      console.log("focused mood")
    }
    if (event.code === 'KeyH'){
      console.log("happy mood")
    }
    if (event.code === 'ArrowLeft'){
      console.log("previous mood")
    }
    if (event.code === 'ArrowRight'){
      console.log("next mood")
    }
  }

  function attachKeyboardHandler(){
    bodyElement = document.getElementById('body-id')
    if(bodyElement){
      console.log("run only once")
      bodyElement.addEventListener('keydown', (event)=>{keyboardHandler(event)})
    }
  }

  /**
   * Timer function
   */
  useEffect(() => {
    let intervalId: any;
    if(currentSong && nextSong){
      if (songIsPlaying && timerTime <= currentSong?.duration) {
        // setting time from 0 to 1 every 10 milliseconds using javascript setInterval method
        intervalId = setInterval(() => {
          setTimerTime(timerTime + 1)
        }, 1000 / speedValue);
      }
      if (timerTime >= currentSong.duration){
        setSongIsPlaying(false)
      }
    }
    return () => {
      clearInterval(intervalId)
    };
  }, [isPlaying, songIsPlaying, timerTime]);


  /**
   * Check if user has given consent to use local storage
   */
  useEffect(()=>{
    checkConsentCookie(setConsentGiven)
  },[])

  /**
   * Save a local cookie with uuid and mood
   */
  useEffect(()=>{
    if(consentGiven){
      attachKeyboardHandler()
      checkStateCookie(setUuid, selectedMood, setSelectedMood, setError)
    }
  },[consentGiven])

  /**
   * Set up the initial songs
   */
  useEffect(()=>{
    if(consentGiven && uuid && selectedMood){
      getSong(currentPlaylistId).then(song=>{
        if(song){
          setCurrentSong(song)
        }
      })
      getSong(currentPlaylistId).then(song=>{
        if(song){
          setNextSong(song)
        }
      })
    }
  }, [consentGiven, uuid, selectedMood])

  /**
   * Set up the modification nodes
   */
  useEffect(()=>{
    setPitchNode(new Tone.PitchShift(pitchValue))
  }, [consentGiven, uuid, selectedMood])

  /**
   * Put the new song into the player once it is set into currentSong
   */
  useEffect(()=>{
    console.log("Put the new song into the player once it is set into currentSong")
    if(currentSong){
      const _player = new Tone.GrainPlayer(currentSong.url, ()=>{
        setPlayer(_player)
      })
    }
  }, [currentSong])

  /**
   * play the player once it is set
   */
  useEffect(()=>{
    console.log("play the player once it is set")
    if(player){
      if(isPlaying){
        setSongIsPlaying(true)
        player.onstop = skipSong
        player.playbackRate = speedValue
        if(pitchNode){
          player.connect(pitchNode)
        }
        player.start().toDestination()
      } else {
        setSongIsPlaying(false)
        player.onstop = ()=>{}
        player.stop()
      }
    }
  }, [player, isPlaying])

  function play(startAt: number = 0) {
    console.log("play")
    setIsPlaying(true);

  }

  function pause() {
    console.log("pause")
    setIsPlaying(false);
  }

  const skipSong = () => {
    console.log("skip song")
    setTimerTime(0);

    if(nextSong){
      console.log("currentSong will be", nextSong.song_id)
      setCurrentSong(nextSong)

      getSong(currentPlaylistId).then(song=>{
        // @ts-ignore
        console.log("nextSong will be", song.song_id)
        if(song){
          setNextSong(song)
        }
      })
    }
  }



  function handleSetConsentGiven(mode: boolean){
    setConsentGiven(mode)
    const cookies = new Cookies();
    cookies.set('beatbar-consentGiven', 'true', { path: '/', expires: new Date(Date.now() + 31556926000) });
  }

  function handleSetSelectedMood(_mood: MOODS){
    const cookies = new Cookies();
    cookies.set('beatbar-state', JSON.stringify({uuid: uuid, mood: _mood}), { path: '/', expires: new Date(Date.now() + 31556926000) });
    if(uuid){
      setMood(uuid, selectedMood, setCurrentPlaylistId)
    }
    setSelectedMood(_mood)
  }

  return (
    <div className="app">
      {
        !consentGiven?
          <ConsentBanner
            setConsentGiven={handleSetConsentGiven}
          />:
          <></>
      }
      <Background />
      <div className="content">
        <div className="top-line">
          <div>
            <MoodSelector
              selectedMood={selectedMood}
              setSelectedMood={handleSetSelectedMood}
            />
          </div>
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
        <div>
          <label htmlFor={"speedControl"}>Speed</label>
          <input type="number" id="speedControl" onChange={(e)=>adjustSpeedValue(parseInt(e.target.value), setSpeedValue, player)} value={speedValue}/>
          <label htmlFor={"pitchControl"}>Pitch</label>
          <input type="number" id="pitchControl" onChange={(e)=>adjustPitchValue(parseInt(e.target.value), setPitchValue, player)} value={pitchValue}/>
        </div>
        <div className="bottom-line">
          <div className="control-buttons">
            <button
              onClick={()=>{
                isPlaying?
                  pause():
                  play()
              }}
            >
              <img src={isPlaying?pauseIcon:playIcon} alt={"play pause icon to play or pause the current song"} />
            </button>
            <button><img src={previousIcon} alt={"previous icon to jump to the previous song"} /></button>
            <button
              onClick={()=>{
                pause();
                skipSong()
              }}
            ><img src={skipIcon} alt={"skip icon to jump to the next song"} /></button>
            <VolumeControl />
          </div>
          <div className="timestamps">
            <p>{}</p>
            <p>{formatTimeStamp(timerTime)}</p>
            <p>{formatTimeStamp(currentSong?.duration)}</p>
          </div>
          <div className="current-song">
            {currentSong
              ? `currently playing: ${currentSong.title} by ${currentSong.artist}`
              : "No song playing"}
            <br />
            {nextSong
              ? `comming up: ${nextSong.title} by ${nextSong.artist}`
              : "No song in queue"}
            <br />
          </div>
        </div>
      </div>
    </div>
  );
}


/*
<DeveloperOptions
            setShowDeveloperOptions={setShowDeveloperOptions}
            initializePlayer={initializePlayer}
            play={play}
            pause={pause}
            player={player}
            players={players}
            setPlayer={setPlayer}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            currentSong={currentSong}
            setCurrentSong={handleSetCurrentSong}
            nodesInitialized={nodesInitialized}
            setNodesInitialized={setNodesInitialized}
            volume={volume}
            adjustVolume={adjustVolume}
            panorama={panorama}
            adjustPanorama={adjustPanorama}
            speed={speed}
            adjustSpeed={adjustSpeed}
            pitch={pitch}
            adjustPitch={adjustPitch}
            pitchNode={pitchNode}
            setPitchNode={setPitchNode}
            uuid={uuid}
            consentGiven={consentGiven}
            error={error}
            setError={setError}
          />
 */