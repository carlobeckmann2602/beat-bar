import axios from "axios";
import Cookies from "universal-cookie";
import {BeatbarPlayerErrorNames, MOODS} from "../commons/types";
import {apiBaseUrl} from "../commons/commons";

// @ts-ignore
export function getUuid(setUuid: Function, setError: Function, selectedMood: MOODS){
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
      const cookies = new Cookies();
      cookies.set('beatbar-state', JSON.stringify({uuid: res.data.user_id, mood: selectedMood}), { path: '/', expires: new Date(Date.now() + 31556926000) });
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

export function setMood(uuid: string, selectedMood: MOODS, setCurrentPlaylistId: Function){
  axios.post(
    `${apiBaseUrl}post/setmood/`,
    {
      mood: selectedMood.toString()
    },
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Beatbar-UUID":uuid,
        "X-Beatbar-ApiToken":process.env.REACT_APP_API_AUTH_TOKEN
      }
    }
  ).then((res)=>{
    if(res.status===200){
      setCurrentPlaylistId(res.data.playlist_id)
    }
  }).catch(e=>{
    console.log(e)
  })
}
