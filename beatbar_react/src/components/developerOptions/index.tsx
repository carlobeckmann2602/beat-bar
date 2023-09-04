import "./style.css";
import closeIcon from "../../assets/icons/close.svg"
import { ALL_SONGS } from "../../types";

export default function DeveloperOptions(props: any) {
  return (
    <div className="developer-options">
      <div className="developer-options-headline">
        <h2>Developer Options</h2>
        <button type={'button'} onClick={()=>props.setShowDeveloperOptions(false)}><img style={{ color: "black" }} src={closeIcon} alt={"close icon to close the dev tools"} /></button>
      </div>
      <fieldset>
        <p>Select a song, init the player and click play</p>
        <select
          //@ts-ignore
          onChange={(e) => props.setCurrentSong(e.nativeEvent.target?.value)}
        >
          {ALL_SONGS.map((song) => {
            return (
              <option key={song.url} value={JSON.stringify(song)}>
                {song.title} - {song.artist}
              </option>
            );
          })}
        </select>
        <button
          id="initialize-button"
          disabled={!props.currentSong}
          onClick={() => {
            props.initializePlayer();
          }}
        >
          Init Player and load song
        </button>
        <button
          disabled={!props.nodesInitialized}
          id="play-pause-button"
          onClick={() => {
            props.isPlaying ? props.pause() : props.play();
          }}
        >
          Play/Pause
        </button>
      </fieldset>
      <p>Doubleclick a slider to reset</p>
      <fieldset>
        <input
          type="range"
          id="volume"
          min="0"
          max="100"
          value={props.volume}
          onChange={(e) => {
            props.adjustVolume(parseInt(e.target.value));
          }}
          onDoubleClick={() => {
            props.adjustVolume(50);
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
            props.adjustPanorama(parseInt(e.target.value));
          }}
          onDoubleClick={() => {
            props.adjustPanorama(0);
          }}
          value={props.panorama}
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
            props.adjustSpeed(parseInt(e.target.value));
          }}
          onDoubleClick={() => {
            props.adjustSpeed(50);
          }}
          value={props.speed * 50}
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
            props.adjustPitch(parseInt(e.target.value));
          }}
          onDoubleClick={() => {
            props.adjustPitch(0);
          }}
          value={props.pitch}
        />
        <label htmlFor="panner">PITCH</label>
      </fieldset>

      <fieldset>
        <p>Vol: {props.volume}</p>
        <p>Pan: {props.panorama}</p>
        <p>Speed: {props.speed}</p>
        <p>Pitch: {props.pitch}</p>
        <p>Playing? {props.isPlaying ? "Playing" : "Paused"}</p>
      </fieldset>
      <p>Consent Given: {props.consentGiven?"true":"false"}</p>
      <p>UUID: {props.uuid}</p>
      <div>
        <h3>Errors?</h3>
        <pre style={{color: "black", textShadow: 'unset', width: '100%'}}>{JSON.stringify(props.error)}</pre>
        <button onClick={()=>props.setError(undefined)}>Clear error</button>
      </div>
    </div>
  );
}
