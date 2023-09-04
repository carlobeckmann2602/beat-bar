import "./App.css";
import DeveloperOptions from "./components/developerOptions";
import React, { useEffect, useState } from "react";
import * as Tone from "tone";
import {ALL_SONGS, AllSongsUrls, BeatbarPlayerError, BeatbarPlayerErrorNames, Song} from "./types";
import Background from "./components/background/background";

import playIcon from '../src/assets/icons/play.svg'
import pauseIcon from '../src/assets/icons/pause.svg'
import skipIcon from '../src/assets/icons/skip.svg'
import previousIcon from '../src/assets/icons/previous.svg'
import volumeLow from '../src/assets/icons/volume-low.svg'
import volumeMedium from '../src/assets/icons/volume-medium.svg'
import volumeHigh from '../src/assets/icons/volume-high.svg'
import MoodSelector from "./components/moodSelector/moodSelector";
import ConsentBanner from "./components/consentBanner/consentBanner";
import Cookies from 'universal-cookie';
import axios from "axios";
import VolumeControl from "./components/volumeControl/volumeControl";

export default function App() {
  const [showDeveloperOptions, setShowDeveloperOptions] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [player, setPlayer] = useState<Tone.Player>();
  const [players, setPlayers] = useState<Tone.Players>();
  const [currentSong, setCurrentSong] = useState<Song>();
  const [nextSong, setNextSong] = useState<Song>();

  const [nodesInitialized, setNodesInitialized] = useState(false);
  const [volume, setVolume] = useState<number>(50);
  const [panorama, setPanorama] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(1);
  const [pitch, setPitch] = useState<number>(0);
  const [pitchNode, setPitchNode] = useState<Tone.PitchShift>();

  const [consentGiven, setConsentGiven] = useState<boolean>()
  const [uuid, setUuid] = useState<string>()
  const [error, setError] = useState<(BeatbarPlayerError | undefined)>(undefined)

  const apiBaseUrl = process.env.REACT_APP_DEV_API_BASE_URL??'http://localhost:8000/api/'


  let bodyNode: HTMLBodyElement | undefined = undefined;

  function keyboardHandler(event: KeyboardEvent){
    if (event.code === 'Space'){
      console.log("play pause")
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

  useEffect(()=>{
    const cookies = new Cookies()
    let consentGivenCookie = cookies.get('beatbar-consentGiven')
    if(consentGivenCookie === "true"){
      setConsentGiven(true)
      console.log("consent has been given. Will set it now in state")
    }
  },[])

  useEffect(()=>{
    const cookies = new Cookies()
    let uuidCookie = cookies.get('beatbar-uuid')
    if(uuidCookie){
      setUuid(uuidCookie)
      console.log("uuid has been found. Will set it now in state")
    } else {
      console.log("uuid has not been found. Will request it now")
      axios.post(
        `${apiBaseUrl}post/register/`,
        null,
        {
          headers: {
            Accept: "application/json",
            "X-Beatbar-ApiToken":process.env.REACT_APP_API_AUTH_TOKEN
          }
        }
      ).then((res)=>{
        if(res.status === 201){
          setUuid(res.data.user_id)
        }
      }).catch(err=>{
        console.log(err)
        if(err.code==="ERR_NETWORK"){
          setError({
            code: 503,
            name: BeatbarPlayerErrorNames.INTERNAL_SERVER_ERROR,
            description: "The Server is currently not available. Try again later.",
            isFatal: false
          })
        }
        if(err.status === 500){
          setError({
            code: 500,
            name: BeatbarPlayerErrorNames.INTERNAL_SERVER_ERROR,
            description: "Something went wrong on the server. Please try again later.",
            isFatal: false
          })
        }
        if(err.status === 404){
          setError({
            code: 404,
            name: BeatbarPlayerErrorNames.RESOURCE_NOT_FOUND,
            description: "The requested Resource could not be found on the server. Please try something else.",
            isFatal: false
          })
        }
        if(err.status === 403){
          setError({
            code: 403,
            name: BeatbarPlayerErrorNames.AUTHORIZATION_ERROR,
            description: "You are not authorized to request this resource",
            isFatal: false
          })
        }
        if(err.status === 401){
          setError({
            code: 401,
            name: BeatbarPlayerErrorNames.AUTHENTICATION_ERROR,
            description: "You are not authenticated correctly to request this resource",
            isFatal: false
          })
        }
      })
    }
  },[])

  // Play a song when its put into the current song state
  useEffect(() => {
    play();
  }, [currentSong]);

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

    const _players = new Tone.Players(allSongsUrls);
    if (_players) {
      setPlayers(_players);
      console.log("players node set");
    }

    const _pitchNode = new Tone.PitchShift().toDestination();
    if (_pitchNode) {
      _pitchNode.pitch = pitch;
      setPitchNode(_pitchNode);
      console.log("pitch node set");
    }
  }

  function play(startAt: number = 0) {
    if (players && currentSong && pitchNode) {
      players.player(currentSong.title).onstop = playNextSong;
      pitchNode.pitch = pitch;
      players.player(currentSong.title).connect(pitchNode).start(startAt);
      setIsPlaying(true);
    }
  }

  function pause() {
    if (players && currentSong) {
      players.player(currentSong.title).onstop = () => {};
      players.player(currentSong?.title).stop();
      setIsPlaying(false);
    }
  }

  function handleSetCurrentSong(song: string) {
    setCurrentSong(JSON.parse(song));
    loadNextSong();
  }

  function loadNextSong() {
    let index = Math.ceil(Math.random() * ALL_SONGS.length);
    if (index > 5) {
      index = 5;
    }
    if (index < 0) {
      index = 0;
    }
    setNextSong(ALL_SONGS[index]);
  }

  function playNextSong() {
    if (currentSong) {
      players?.player(currentSong?.title).stop();
    }
    if (players && nextSong) {
      players.player(nextSong.title).onstop = playNextSong;
      setCurrentSong(nextSong);
      loadNextSong();
    }
  }

  function adjustPitch(_pitch: number) {
    setPitch(_pitch);
    console.log("pitch: ", pitch);
  }

  function adjustVolume(_volume: number) {
    setVolume(_volume);
  }

  function adjustPanorama(_pan: number) {
    setPanorama(_pan);
  }

  function adjustSpeed(_speed: number) {
    console.log("adjust speed");
    if (players && currentSong) {
      players.player(currentSong.title).playbackRate = _speed / 50;
    }
    setSpeed(_speed / 50);
  }

  function handleSetConsentGiven(mode: boolean){
    setConsentGiven(mode)
    const cookies = new Cookies();
    cookies.set('beatbar-consentGiven', 'true', { path: '/', expires: new Date(Date.now() + 31556926000) });
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
            <MoodSelector />
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
        <div style={{ visibility: showDeveloperOptions ? "visible" : "hidden" }}>
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
        </div>
        <div className="bottom-line">
          <div
            className="developer-options-trigger"
            onClick={() => {
              setShowDeveloperOptions(!showDeveloperOptions);
            }}
          >
            Developer Options
          </div>
          <div className="control-buttons">
            <img src={isPlaying?pauseIcon:playIcon} alt={"play pause icon to play or pause the current song"} />
            <img src={previousIcon} alt={"previous icon to jump to the previous song"} />
            <img src={skipIcon} alt={"skip icon to jump to the next song"} />
            <VolumeControl />
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
