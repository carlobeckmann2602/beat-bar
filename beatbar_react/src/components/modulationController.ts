import * as Tone from "tone";

export function adjustPitchValue(_pitchValue: number, setPitchValue: Function, player: Tone.GrainPlayer | undefined) {
  console.log("_pitchValue: ", _pitchValue)
  if(player){
    player.detune = _pitchValue
  }
  setPitchValue(_pitchValue)
}

export function adjustSpeedValue(_speedValue: number, setSpeedValue: Function, player: Tone.GrainPlayer | undefined) {
  console.log("_speedValue: ", _speedValue);
  console.log("adjusted to: ", _speedValue / 100);
  if(player){
    player.playbackRate = _speedValue / 100
  }
  setSpeedValue(_speedValue / 100);
}