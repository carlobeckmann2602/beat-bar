import "./App.css";
import React, {useEffect, useState} from "react";
import * as Tone from "tone";
import {BeatbarPlayerError, HALFTONES_MAP, MOODS, Song} from "./commons/types";
import {HALFTONESTEPS} from "./commons/commons";
import Background from "./components/background/background";

import playIcon from '../src/assets/icons/play.svg'
import pauseIcon from '../src/assets/icons/pause.svg'
import skipIcon from '../src/assets/icons/skip.svg'
import stopIcon from '../src/assets/icons/stop.svg'
import MoodSelector from "./components/moodSelector/moodSelector";
import ConsentBanner from "./components/consentBanner/consentBanner";
import VolumeControl from "./components/volumeControl/volumeControl";
import {getSong} from "./components/playlistController";
import {checkConsentCookie, checkStateCookie, handleSetConsentGiven} from "./components/cookieController";
import {formatTimeStamp} from "./components/helper/format";
import {debugSong} from "./components/helper/debug";
import {lerp} from "./components/helper/math";
import LoadingScreen from "./components/loadingScreen/loadingScreen";
import {setMood} from "./components/backendController";

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [player, setPlayer] = useState<Tone.GrainPlayer>();
  const [currentSong, setCurrentSong] = useState<Song>();
  const [nextSong, setNextSong] = useState<Song>();
  const [currentPlaylistId, setCurrentPlaylistId] = useState<number>()
  const [playlistLoading, setPlaylistLoading] = useState(false)

  const [selectedMood, setSelectedMood] = useState<MOODS>(MOODS.party)

  const [volume, setVolume] = useState(7/7)
  const [speedValue, setSpeedValue] = useState<number>(1);
  const [pitchNode, setPitchNode] = useState<Tone.PitchShift>();
  const [pitchValue, setPitchValue] = useState<number>(0);
  const [songIsPlaying, setSongIsPlaying] = useState(false)

  const [consentGiven, setConsentGiven] = useState<boolean>()
  const [uuid, setUuid] = useState<string>()
  const [error, setError] = useState<(BeatbarPlayerError | undefined)>(undefined)

  const [timerTime, setTimerTime] = useState(0)

  const [isFading, setIsFading] = useState(false)
  const [isFirstSong, setIsFirstSong] = useState(true)

  const [songPausedAt, setSongPausedAt] = useState(0)

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
      updateMood(MOODS.sad)
    }
    if (event.code === 'KeyR'){
      updateMood(MOODS.relaxed)
    }
    if (event.code === 'KeyA'){
      updateMood(MOODS.aggressive)
    }
    if (event.code === 'KeyH'){
      updateMood(MOODS.happy)
    }
    if (event.code === 'KeyP'){
      updateMood(MOODS.party)
    }
  }

  useEffect(()=>{
    console.log("volume: ", volume)
  }, [volume])

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
      if (timerTime >= (currentSong.cuepoint_out)){
        if(!isFading){
          setIsFading(true)
          console.log("timerTime: ", timerTime)
          console.log("currentSong.duration: ", currentSong.duration)
          console.log("currentSong.cuepoint_out: ", currentSong.cuepoint_out)
          console.log("DO FADE")
          skipSong()
        }
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

  useEffect(()=>{
    console.log("playlistLoading: ", playlistLoading)
  }, [playlistLoading])

  /**
   * Save a local cookie with uuid and mood
   */
  useEffect(()=>{
    if(consentGiven){
      attachKeyboardHandler()
      checkStateCookie(setUuid, selectedMood, setSelectedMood, setCurrentPlaylistId, setError)
    }
  },[consentGiven])

  /**
   * Set up the initial songs
   */
  useEffect(()=>{
    if(consentGiven && uuid && selectedMood && currentPlaylistId){
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
  }, [consentGiven, uuid, selectedMood, currentPlaylistId])

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
   * play the player once it is set or play/pause has been triggered
   */
  useEffect(()=>{
    console.log("play the player once it is set")
    if(player){
      if(isPlaying){
        setSongIsPlaying(true)
        //player.onstop = skipSong
        player.playbackRate = speedValue


        let x = 0;

        let int = setInterval(()=>{
          let y = (Math.cos((x/100)*Math.PI)/2+.5)*-1
          player.volume.value = 50 * volume * y;
          x+=1;
          if(y >= 0){
            player.volume.value = 0;
            clearInterval(int)
          }
        }, 20)

        if(isFirstSong){
          if(songPausedAt!==0){
            player.start("0", songPausedAt).toDestination()
            setSongPausedAt(0)
          } else {
            player.start("0", "0").toDestination()
          }
          setIsFirstSong(false)
        } else {
          if(songPausedAt!==0){
            player.start("0", songPausedAt).toDestination()
            setSongPausedAt(0)
          } else {
            player.start("0", currentSong?.cuepoint_in??"0").toDestination()
          }
          setTimeout(()=>{
            console.log("readjustModulation now?")
            readjustModulation()
          }, 20000)
        }
      } else {
        setSongIsPlaying(false)
        player.onstop = ()=>{}
        player.stop()
      }
    }
  }, [player, isPlaying])

  useEffect(()=>{
    if(player){
      player.volume.value = -50 * (1 - volume)
      console.log(player.volume.value)
    }
  }, [volume])

  function play(startAt: number = 0) {
    console.log("play")
    setIsPlaying(true);
  }

  function pause() {
    console.log("pause")
    setSongPausedAt(timerTime)
    setIsPlaying(false);
  }

  const skipSong = (isIntentionalSkip = false) => {
    console.log("skip song")
    setTimerTime(0);
    if(currentSong && nextSong && !isIntentionalSkip){
      adaptModulationForTransition(currentSong, nextSong)
    }
    setTimeout(()=>{
      if(currentSong && nextSong && currentPlaylistId){
        console.log("currentSong will be", nextSong.song_id)

        setCurrentSong(nextSong)

        getSong(currentPlaylistId).then(song=>{
          // @ts-ignore
          console.log("nextSong will be", song.song_id)
          if(song){
            setNextSong(song)
          }
        })
        setIsFading(false)
      }
    }, 500)
  }

  function adaptModulationForTransition(fromSong: Song, toSong: Song){
    console.log("adaptModulationForTransition")
    if(fromSong && toSong){
      setSpeedValue(fromSong.bpm/toSong.bpm)
      // setPitchValue(getHalftoneSteps(fromSong.key, toSong.key) * 100)
    }
  }

  function readjustModulation(){
    if(player){
      let x = 0;
      const oldSpeed = speedValue;
      let oldPitch = pitchValue

      let int = setInterval(()=>{
        let y = 1 - (Math.cos((x/100)*Math.PI)/2+.5) + 0.001
        console.log(y)

        // setPitchValue(lerp(1 - oldPitch, 0, y))
        setSpeedValue(lerp(oldSpeed, 1, y))

        // player.detune = lerp(1 - oldPitch, 0, y)
        player.playbackRate =lerp(oldSpeed, 1, y)


        if(y >= 1){
          setSpeedValue(1)
          // setPitchValue(0)

          // player.detune = 0;
          player.playbackRate = 1;

          clearInterval(int)
        }
        x+=1;
      }, 100)

    }
  }

  function getHalftoneSteps(fromTone: string, toTone: string): number{
    return HALFTONESTEPS[HALFTONES_MAP[fromTone]][HALFTONES_MAP[toTone]]
  }

  function updateMood(_mood: MOODS){
    if(uuid){
      setMood(uuid, _mood, setCurrentPlaylistId, setPlaylistLoading)
      console.log("updating mood to", _mood)
      if(player){
        setIsPlaying(false)
      }
    }
  }

  return (
    <div className="app">
      {
        !consentGiven?
          <ConsentBanner
            handleSetConsentGiven={handleSetConsentGiven}
            setConsentGiven={setConsentGiven}
          />:
          <></>
      }
      {
        playlistLoading?
          <LoadingScreen/>:
          ''
      }
      <Background />
      <div className="content">
        <div className="top-line">
          <div>
            <MoodSelector
              selectedMood={selectedMood}
              uuid={uuid??'00000000-0000-0000-0000-000000000000'}
              setCurrentPlaylist={setCurrentPlaylistId}
              setSelectedMood={setSelectedMood}
              setPlaylistLoading={setPlaylistLoading}
              updateMood={updateMood}
            />
          </div>
          <h1>beat.bar</h1>
          <ul className="control-options">
            <li>
              <span className="control-option-label">spacebar</span> play/pause
            </li>
            <li>
              <span className="control-option-label">s</span> sad mood
            </li>
            <li>
              <span className="control-option-label">r</span> relaxed mood
            </li>
            <li>
              <span className="control-option-label">a</span> aggressive mood
            </li>
            <li>
              <span className="control-option-label">h</span> happy mood
            </li>
            <li>
              <span className="control-option-label">p</span> party mood
            </li>
          </ul>
        </div>
        <div>

          <p>current BPM: {speedValue}</p>
          <p>current  Pitch: {pitchValue}</p>
          <div>
            <p>Current</p>
            {currentSong?debugSong(currentSong):''}
            <p>Next</p>
            {nextSong?debugSong(nextSong):''}
          </div>
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
            <button onClick={()=>{
              setSongPausedAt(0)
              setIsPlaying(false)
              setTimerTime(0)
            }}><img src={stopIcon} alt={"icon to stop the current song and go to its start"} /></button>
            <button
              onClick={()=>{
                if(player){
                  player.onstop = ()=>{}
                  player.stop()
                  setIsFading(true)
                  skipSong(true)
                }
              }}
            ><img src={skipIcon} alt={"skip icon to jump to the next song"} /></button>
            <VolumeControl
              setVolume={setVolume}
            />
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