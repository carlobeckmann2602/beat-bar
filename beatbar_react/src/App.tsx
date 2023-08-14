import "./App.css";
import DeveloperOptions from "./components/developerOptions";
import React, { useEffect, useState } from "react";
import * as Tone from "tone";
import { ALL_SONGS, AllSongsUrls, Song } from "./types";
import { Decibels } from "tone/build/esm/core/type/Units";

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

  document.getElementsByTagName("body")[0]?.addEventListener(
    "keydown",
    (event) => {
      console.log(event);
    },
    false,
  );

  useEffect(() => {
    play();
  }, [currentSong]);

  useEffect(() => {
    if (pitchNode) {
      pitchNode.pitch = pitch;
    }
  }, [pitch]);

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
      <div style={{ visibility: showDeveloperOptions ? "visible" : "hidden" }}>
        <DeveloperOptions
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
        <div className="control-buttons">ply pre nxt vol</div>
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
  );
}
