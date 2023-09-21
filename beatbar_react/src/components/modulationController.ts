import * as Tone from "tone";

export const adjustPitchValue = (_pitchValue: number, setPitchValue: Function, player: Tone.GrainPlayer | undefined) => {
  console.log("_pitchValue: ", _pitchValue)
  if(player){
    player.detune = _pitchValue
  }
  setPitchValue(_pitchValue)
}

export const adjustSpeedValue = (_speedValue: number, setSpeedValue: Function, player: Tone.GrainPlayer | undefined) => {
  console.log("_speedValue: ", _speedValue);
  console.log("adjusted to: ", _speedValue / 100);
  console.log("using player: ", player)
  if(player){
    player.playbackRate = _speedValue / 100
  }
  setSpeedValue(_speedValue / 100);
}