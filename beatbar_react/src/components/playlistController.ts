import {apiBaseUrl} from "../commons/commons";
import axios, {AxiosResponse} from "axios";
import {SongResponse} from "../commons/types";
export async function getSong(playlistId: number){
  return axios.get(
    `${apiBaseUrl}getnextsong/?playlist_id=${playlistId}`,
    {
      headers: {
        Accept: "application/json",
        "X-Beatbar-ApiToken":process.env.REACT_APP_API_AUTH_TOKEN
      }
    }
  ).then((res: AxiosResponse<SongResponse>)=>{
    if(res.status===200){
      return ({
        title: res.data.song_id.split('_')[0],
        artist: res.data.song_id.split('_')[1],
        url: (process.env.REACT_APP_DEV_CDN_BASE_URL??'http://localhost:3001/')+res.data.song_id,
        song_id: res.data.song_id,
        duration: res.data.duration, // We need to modify this values due to samplingrate mismatches in essentia
        key: res.data.key,
        scale: res.data.scale,
        key_scale_strength: res.data.key_scale_strength,
        bpm: res.data.bpm * (44100 / 48000), // We need to modify this values due to samplingrate mismatches in essentia
        energy: res.data.energy,
        danceability: res.data.danceability,
        cuepoint_in: res.data.cuepoint_in  * (44100 / 48000), // We need to modify this values due to samplingrate mismatches in essentia
        cuepoint_out: res.data.cuepoint_out  * (44100 / 48000) // We need to modify this values due to samplingrate mismatches in essentia
      })
    }
  })
}