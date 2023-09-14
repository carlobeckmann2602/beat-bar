import Cookies from "universal-cookie";
import {getUuid, setMood} from "./backendController";
import {MOODS} from "../commons/types";

export function checkConsentCookie(setConsentGiven: Function){
  const cookies = new Cookies()
  let consentGivenCookie = cookies.get('beatbar-consentGiven')
  if(consentGivenCookie === "true"){
    setConsentGiven(true)
    console.log("consent has been given. Will set it now in state")
  }
}

export function handleSetConsentGiven(setConsentGiven: Function, _mode: boolean){
  setConsentGiven(_mode)
  const cookies = new Cookies();
  cookies.set('beatbar-consentGiven', 'true', { path: '/', expires: new Date(Date.now() + 31556926000) });
}

export function checkStateCookie(setUuid: Function, selectedMood: MOODS, setSelectedMood: Function, setError: Function){
  const cookies = new Cookies()
  let stateCookie = cookies.get('beatbar-state')

  if(stateCookie && stateCookie['uuid']){
    setUuid(stateCookie.uuid)
    setSelectedMood(stateCookie.mood)
  } else {
    getUuid(setUuid, setError, selectedMood)
  }
}

export function handleSetSelectedMood(uuid: string, _mood: MOODS, selectedMood: MOODS, setCurrentPlaylistId: Function, setSelectedMood: Function){
  const cookies = new Cookies();
  cookies.set('beatbar-state', JSON.stringify({uuid: uuid, mood: _mood}), { path: '/', expires: new Date(Date.now() + 31556926000) });
  if(uuid){
    setMood(uuid, selectedMood, setCurrentPlaylistId)
  }
  setSelectedMood(_mood)
}