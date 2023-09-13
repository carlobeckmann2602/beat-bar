export function formatTimeStamp(time: number | undefined): string {
  let minutes: string = "00"
  let seconds: string = "00"
  if(time){
    const minutesAsNum = Math.floor(time/60)
    if(minutesAsNum>=10){
      minutes = minutesAsNum.toString()
    } else {
      minutes = "0"+minutesAsNum.toString()
    }

    const secondsAsNum = time%60
    if(secondsAsNum>=10){
      seconds = secondsAsNum.toString()
    } else {
      seconds = "0"+secondsAsNum.toString()
    }
  }

  return `${minutes}:${seconds}`
}