import {Song} from "../../commons/types";

export function debugSong(song: Song){
  let out = [];
  let attr = Object.keys(song)
  for(const key of attr){
    out.push(
      // @ts-ignore
      <li key={`debug-song-${song.song_id}-${key}`}>{key}: {song[key]??'n.a.'}</li>
    )
  }
  return (<ul style={{fontSize: '11px'}}>{out}</ul>);
}