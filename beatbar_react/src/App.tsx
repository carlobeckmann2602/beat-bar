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

export default function App() {
  const [showDeveloperOptions, setShowDeveloperOptions] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [player, setPlayer] = useState<Tone.Player>();
  const [players, setPlayers] = useState<Tone.Players>(new Tone.Players());
  const [currentSong, setCurrentSong] = useState<Song>();
  const [nextSong, setNextSong] = useState<Song>();
  const [currentPlaylistId, setCurrentPlaylistId] = useState(1)

  const [selectedMood, setSelectedMood] = useState<MOODS>(MOODS.focused)

  const [nodesInitialized, setNodesInitialized] = useState(false);
  const [volume, setVolume] = useState<number>(50);
  const [panorama, setPanorama] = useState<number>(0);
  const [speedNode, setSpeedNode] = useState<number>(1);
  const [pitchNode, setPitchNode] = useState<Tone.PitchShift>();
  const [pitchValue, setPitchValue] = useState<number>(0);

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
      if (isPlaying && timerTime <= currentSong?.duration) {
        // setting time from 0 to 1 every 10 milliseconds using javascript setInterval method
        intervalId = setInterval(() => {
          setTimerTime(timerTime + 1)
        }, 1000 / speedNode);
      }
      if (timerTime >= (currentSong.duration - crossFadeTime) && !crossFadeDone) {
        //players.player(nextSong.song_id).start(Tone.now()).toDestination()
        //players.player(nextSong.song_id).playbackRate = speedNode
        //playNextSong(true)
        //setCrossFadeDone(true)
      }
      if (timerTime >= currentSong.duration){
        //setIsPlaying(false)
      }
    }
    return () => {
      clearInterval(intervalId)
    };
  }, [isPlaying, timerTime]);


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
   * play a song once it is put into currentSong and isPlaying is set to true
   */
  useEffect(()=>{
    console.log("isPlaying: ", isPlaying)
    if(currentSong){
      /*
      if(isPlaying){
        console.log("play ", currentSong.song_id)
        if(!players.has(currentSong.song_id)) {
          players.add(currentSong.song_id, currentSong.url,()=>{
            // We need to call the play routine specifically here, because we need to wait for the newly created player to be loaded
            players.player(currentSong.song_id).start(Tone.now()).toDestination()
            players.player(currentSong.song_id).onstop = skipSong
            players.player(currentSong.song_id).playbackRate = speedNode
          })
        } else {
          players.player(currentSong.song_id).start(Tone.now()).toDestination()
          players.player(currentSong.song_id).onstop = skipSong
          players.player(currentSong.song_id).playbackRate = speedNode
        }
      } else {
        if(!players.has(currentSong.song_id)){
          players.add(currentSong.song_id, currentSong.url)
        }
        players.player(currentSong.song_id).onstop = ()=>{}
        players.player(currentSong.song_id).stop()
      }
      */
      const grainPlayer = new Tone.GrainPlayer(currentSong.url, ()=>{
        if(isPlaying){
          grainPlayer.start().toDestination()
          grainPlayer.onstop = skipSong
        } else {
          grainPlayer.onstop = ()=>{}
          grainPlayer.stop()
        }
      })
    }
  }, [isPlaying, currentSong])

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

    if(nextSong && players){
      console.log("currentSong will be", nextSong.song_id)
      setCurrentSong({...nextSong})

      getSong(currentPlaylistId).then(song=>{
        // @ts-ignore
        console.log("nextSong will be", song.song_id)
        if(song){
          if(!players.has(song.song_id)) {
            players.add(song.song_id, song.url)
          }
          setNextSong({...song})
        }
      })
    }
  }


  /*
  // set the pitch node
  useEffect(() => {
    if (pitchNode) {
      pitchNode.pitch = pitch;
    }
  }, [pitch]);

  // init the pitch node
  useEffect(() => {
    if (pitchNode && players) {
      players.connect(pitchNode);
      console.log("nodes connected");
      setNodesInitialized(true);
    }
  }, [pitchNode, players]);

  function initializePlayer() {
    let allSongsUrls: AllSongsUrls = {};
    ALL_SONGS.forEach((song) => {
      //@ts-ignore
      allSongsUrls[song.title] = song.url;
    });

    const _pitchNode = new Tone.PitchShift().toDestination();
    if (_pitchNode) {
      _pitchNode.pitch = pitch;
      setPitchValue(_pitchNode);
      console.log("pitch node set");
    }
  }
  */


  function adjustPitchValue(_pitchValue: number) {
    console.log("_pitchValue: ", _pitchValue)
    let _pitchNode = pitchNode
    if(currentSong && _pitchNode){
      players.player(currentSong.song_id).disconnect()
      players.player(currentSong.song_id).connect(new Tone.PitchShift(_pitchValue)).toDestination()
      _pitchNode.pitch = _pitchValue
    }
    setPitchNode(_pitchNode)
    setPitchValue(_pitchValue);
  }

  function adjustVolume(_volume: number) {
    setVolume(_volume);
  }

  function adjustPanorama(_pan: number) {
    setPanorama(_pan);
  }

  function adjustSpeed(_speed: number) {
    console.log("adjust speedNode");
    if (players && currentSong) {
      players.player(currentSong.title).playbackRate = _speed / 50;
    }
    setSpeedNode(_speed / 50);
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
          <input onChange={(e)=>adjustPitchValue(parseInt(e.target.value))} value={pitchValue}/>
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