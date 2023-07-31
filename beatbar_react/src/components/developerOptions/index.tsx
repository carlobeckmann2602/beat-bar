import './style.css'
import {useEffect, useState} from "react";
import * as Tone from 'tone'
import {Song} from "../../types";

export default function DeveloperOptions(props: any) {
  const [nodesInitialized, setNodesInitialized] = useState(false)
  const [volume, setVolume] = useState<number>(50)
  const [panorama, setPanorama] = useState<number>(0)
  const [speed, setSpeed] = useState<number>(1)
  const [pitch, setPitch] = useState<number>(0)
  const [volumeNode, setVolumeNode] = useState<GainNode>()
  const [panoramaNode, setPanoramaNode] = useState<StereoPannerNode>()
  const [speedNode, setSpeedNode] = useState()
  const [pitchNode, setPitchNode] = useState<Tone.PitchShift>()
  const [audioCtx, setAudioCtx] = useState<AudioContext>()
  const [currentSong, setCurrentSong] = useState<Song>()

  const ALL_SONGS = [
    {
      title: "Embrace",
      artist: "ItsWatR",
      url: "http://localhost:3001/embrace_itswatr.mp3"
    },
    {
      title: "Spirit Blossom",
      artist: "RomanBelov",
      url: "http://localhost:3001/spirit-blossom_roman-belov.mp3"
    },
    {
      title: "LoFi Chill (Medium Version)",
      artist: "BoDleasons",
      url: "http://localhost:3001/lofi-chill-medium-version_bo-dleasons.mp3"
    },
    {
      title: "Lofi Study",
      artist: "FASSounds",
      url: "http://localhost:3001/lofi-study_fassounds.mp3"
    },
    {
      title: "Storm Clouds",
      artist: "Purple Cat",
      url: "http://localhost:3001/storm-clouds_purpple-cat.mp3"
    },
    {
      title: "Watr-Fluid",
      artist: "ItsWatR",
      url: "http://localhost:3001/watr-fluid_itswatr.mp3"
    }
  ]

  useEffect(() => {
    if (props.player) {
      initializeNodes()
    }
  }, [props.player])

  function initializePlayer() {
    if(props.currentSong){
      const _player = new Tone.Player({
        url: props.currentSong.url,
        loop: true,
        autostart: false,
      })
      if (_player) {
        props.setPlayer(_player)
      }
    }
  }

  function initializeNodes() {
    const _pitchNode = new Tone.PitchShift(pitch).toDestination();
    props.player?.connect(_pitchNode)
    setPitchNode(_pitchNode)
    setNodesInitialized(true)
  }

  function play() {
    if (props.player) {
      props.player.start()
      props.setIsPlaying(true)
    }
  }

  function pause() {
    if (props.player) {
      props.player.stop()
      props.setIsPlaying(false)
    }
  }

  function adjustPitch(_pitch: number) {
    if (pitchNode) {
      pitchNode.pitch = _pitch;
    }
    setPitch(_pitch)
  }

  function adjustVolume(_volume: number) {
    setVolume(_volume)
  }

  function adjustPanorama(_pan: number) {
    setPanorama(_pan)
  }

  function adjustSpeed(_speed: number) {
    if (props.player) {
      props.player.playbackRate = _speed / 50;
      adjustPitch(0)
    }
    setSpeed(_speed / 50);
  }

  return (
    <div className="developer-options">
      <h2>Developer Options</h2>
      <fieldset>
        <p>Select a song, init the player and click play</p>
        <select
          //@ts-ignore
          onChange={(e)=>props.setCurrentSong(e.nativeEvent.target?.value)}
        >
          {
            ALL_SONGS.map(song=>{
              return (
                <option
                  key={song.url}
                  // selected={props.currentSong === song.url}
                  // onClick={()=>{props.setCurrentSong(song)}}
                  value={JSON.stringify(song)}
                >
                  {song.title} - {song.artist}
                </option>
              )
            })
          }
        </select>
        <button
          id="initialize-button"
          disabled={currentSong !== undefined}
          onClick={() => {
            initializePlayer()
          }}
        >Init Player and load song
        </button>
        <button
          disabled={!nodesInitialized}
          id="play-pause-button"
          onClick={() => {
            props.isPlaying ? pause() : play()
          }}
        >Play/Pause
        </button>
      </fieldset>
      <p>Doubleclick a slider to reset</p>
      <fieldset>
        <input
          type="range"
          id="volume"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => {
            adjustVolume(parseInt(e.target.value))
          }}
          onDoubleClick={() => {
            adjustVolume(50)
          }}
        />
        <label htmlFor="volume">VOL</label>
      </fieldset>

      <fieldset>
        <input
          type="range"
          id="panner"
          min="-100"
          max="100"
          onChange={(e) => {
            adjustPanorama(parseInt(e.target.value))
          }}
          onDoubleClick={() => {
            adjustPanorama(0)
          }}
          value={panorama}
        />
        <label htmlFor="panner">PAN</label>
      </fieldset>

      <fieldset>
        <input
          type="range"
          id="speed"
          min="1"
          max="100"
          onChange={(e) => {
            adjustSpeed(parseInt(e.target.value))
          }}
          onDoubleClick={() => {
            adjustSpeed(50)
          }}
          value={speed * 50}
        />
        <label htmlFor="panner">SPEED</label>
      </fieldset>

      <fieldset>
        <input
          type="range"
          id="pitch"
          min="-12"
          max="12"
          onChange={(e) => {
            adjustPitch(parseInt(e.target.value))
          }}
          onDoubleClick={() => {
            adjustPitch(0)
          }}
          value={pitch}
        />
        <label htmlFor="panner">PITCH</label>
      </fieldset>

      <fieldset>
        <p>Vol: {volume}</p>
        <p>Pan: {panorama}</p>
        <p>Speed: {speed}</p>
        <p>Pitch: {pitch}</p>
        <p>Playing? {props.isPlaying ? "Playing" : "Paused"}</p>
      </fieldset>
    </div>
  )
}