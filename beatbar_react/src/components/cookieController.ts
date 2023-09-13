import Cookies from "universal-cookie";
import {getUuid} from "./backendController";
import {MOODS} from "../commons/types";

export function checkConsentCookie(setConsentGiven: Function){
  const cookies = new Cookies()
  let consentGivenCookie = cookies.get('beatbar-consentGiven')
  if(consentGivenCookie === "true"){
    setConsentGiven(true)
    console.log("consent has been given. Will set it now in state")
  }
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