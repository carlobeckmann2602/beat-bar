import './style.css'
import {useEffect, useState} from "react";
import * as Tone from 'tone'

export default function DeveloperOptions() {
  const [sourcesInitialized, setSourcesInitialized] = useState<boolean>(false)
  const [trackInitialized, setTrackInitialized] = useState<boolean>(false)
  const [nodesInitialized, setNodesInitialized] = useState<boolean>(false)
  const [isReadyToPlay, setIsReadyToPlay] = useState<boolean>(false)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [volume, setVolume] = useState<number>(50)
  const [panorama, setPanorama] = useState<number>(0)
  const [speed, setSpeed] = useState<number>(100)
  const [pitch, setPitch] = useState<number>(0)
  const [volumeNode, setVolumeNode] = useState<GainNode>()
  const [panoramaNode, setPanoramaNode] = useState<StereoPannerNode>()
  const [speedNode, setSpeedNode] = useState()
  const [pitchNode, setPitchNode] = useState<Tone.PitchShift>()
  const [audioCtx, setAudioCtx] = useState<AudioContext>()
  const [audioElement, setAudioElement] = useState<HTMLAudioElement>()
  const [track, setTrack] = useState<MediaElementAudioSourceNode>()

  useEffect(()=>{
    if(audioCtx && audioElement){
      console.log("Sources initialized. Will init track now.")
      setSourcesInitialized(true)
    }
  }, [audioCtx, audioElement])

  useEffect(()=>{
    if(sourcesInitialized){
      initializeTrack()
      console.log("Track initialized. Will init nodes now.")
      setTrackInitialized(true)
    }
  }, [sourcesInitialized])

  useEffect(()=>{
    if(trackInitialized){
      initializeNodes()
      console.log("Nodes initialized. Will connect track now.")
      setNodesInitialized(true)
    }
  }, [trackInitialized])

  useEffect(()=>{
    if(nodesInitialized){
      connectTrack()
      console.log("Track connected. Ready to play.")
      setIsReadyToPlay(true)
    }
  }, [nodesInitialized])

  function initializeSources(){
    setAudioCtx(new AudioContext());
    let _audioElement = document.querySelector("audio")
    if(_audioElement){
      setAudioElement(_audioElement);
    }
  }

  function initializeTrack(){
    if(audioCtx && audioElement){
      setTrack(new MediaElementAudioSourceNode(audioCtx, {
        mediaElement: audioElement,
      }))

    }
  }

  function initializeNodes(){
    if(audioCtx){
      const _pannerNode = new StereoPannerNode(audioCtx, { pan: 0 });
      _pannerNode.pan.value = panorama / 100;
      setPanoramaNode(_pannerNode)

      const _gainNode = new GainNode(audioCtx);
      _gainNode.gain.value = volume / 100;
      setVolumeNode(_gainNode)

      const _pitchNode = new Tone.PitchShift()
      _pitchNode.pitch = pitch;
      setPitchNode(_pitchNode)
    }
  }

  function connectTrack(){
    if(audioCtx && volumeNode && panoramaNode && pitchNode){
      track?.connect(volumeNode).connect(panoramaNode).connect(audioCtx.destination)
    }
  }

  function play(){
    if (audioCtx?.state === "suspended") {
      audioCtx.resume().then(r => console.log("audioCtx resumed"));
    }
    if(audioElement){
      audioElement.playbackRate = speed / 100;
      audioElement.play().then(r=>{setIsPlaying(true)});
    }
  }

  function pause(){
    if(audioElement){
      audioElement.pause()
    }
    setIsPlaying(false)
  }

  function adjustVolume(volume: number){
    setVolume(volume)
    if(volumeNode){
      volumeNode.gain.setValueAtTime(volume / 100, 0);
    }
  }

  function adjustPanorama(panorama: number){
    setPanorama(panorama)
    if(panoramaNode){
      panoramaNode.pan.value = panorama / 100;
    }
  }

  function adjustSpeed(speed: number){
    if(speed > 10){
      setSpeed(speed)
      if(audioElement){
        audioElement.playbackRate = speed / 10;
      }
    }
  }

  return (
    <div className="developer-options">
      <h2>Developer Options</h2>
      <audio src="http://localhost:3001/storm-clouds-purpple-cat.mp3" crossOrigin="anonymous"></audio>
      <fieldset>
        <button
          id="play-pause-button"
          onClick={()=>{initializeSources()}}
        >Initialize Player</button>
        <button
          disabled={!isReadyToPlay}
          id="play-pause-button"
          onClick={()=>{isPlaying?pause():play()}}
        >Play/Pause</button>
      </fieldset>
      <p>Doubleclick a slider to reset</p>
      <fieldset>
        <input
          type="range"
          id="volume"
          min="0"
          max="100"
          value={volume}
          onChange={(e)=>{adjustVolume(parseInt(e.target.value))}}
          onDoubleClick={()=>{adjustVolume(50)}}
        />
        <label htmlFor="volume">VOL</label>
      </fieldset>

      <fieldset>
        <input
          type="range"
          id="panner"
          min="-100"
          max="100"
          onChange={(e)=>{adjustPanorama(parseInt(e.target.value))}}
          onDoubleClick={()=>{adjustPanorama(0)}}
          value={panorama}
        />
        <label htmlFor="panner">PAN</label>
      </fieldset>

      <fieldset>
        <input
          type="range"
          id="speed"
          min="1"
          max="160"
          onChange={(e)=>{adjustSpeed(parseInt(e.target.value))}}
          onDoubleClick={()=>{adjustSpeed(100)}}
          value={speed}
        />
        <label htmlFor="panner">SPEED</label>
      </fieldset>

      <fieldset>
        <p>Vol: {volume}</p>
        <p>Pan: {panorama}</p>
        <p>Speed: {speed}</p>
        <p>Playing? {isPlaying?"Playing":"Paused"}</p>
      </fieldset>
    </div>
  )
}