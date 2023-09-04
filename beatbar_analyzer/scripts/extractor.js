// Globals

let fetchUrl = ""
let allowAudioContext = false;

const progessSpinner = document.getElementById('progress-spinner')

const continueButton = document.getElementById('continue-button')
if(continueButton){
  continueButton.disabled = true;
  continueButton.addEventListener('click', ()=> continueHandler())
}

const displayInputUrl = document.getElementById('output-input-url')
if(!displayInputUrl){
  console.error("the element with the id 'output-input-url' could not be found in the dom")
}

const displayKey = document.getElementById('output-key')
if(!displayKey){
  console.error("the element with the id 'output-key' could not be found in the dom")
}

const displayScale = document.getElementById('output-scale')
if(!displayScale){
  console.error("the element with the id 'output-scale' could not be found in the dom")
}

const displayKeyScaleStrength = document.getElementById('output-key-scale-strength')
if(!displayKeyScaleStrength){
  console.error("the element with the id 'output-key-scale-strength' could not be found in the dom")
}

const displayDuration = document.getElementById('output-duration')
if(!displayDuration){
  console.error("the element with the id 'output-duration' could not be found in the dom")
}

const displayBpm = document.getElementById('output-bpm')
if(!displayBpm){
  console.error("the element with the id 'output-bpm' could not be found in the dom")
}

const displayEnergy = document.getElementById('output-energy')
if(!displayEnergy){
  console.error("the element with the id 'output-energy' could not be found in the dom")
}

const displayDanceability = document.getElementById('output-danceability')
if(!displayDanceability){
  console.error("the element with the id 'output-danceability' could not be found in the dom")
}

const setInputButton = document.getElementById('set-input-button')
if(setInputButton){
  const inputUrl = document.getElementById('input-url')
  if(inputUrl){
    setInputButton.addEventListener('click', ()=> {
      fetchUrl = inputUrl.value.toString()
      displayInputUrl.innerHTML = inputUrl.value.toString()
      displayInputUrl.href = inputUrl.value.toString()
    })
  }
}

function handleAllowAudioContext(event){
  allowAudioContext = event.target.checked
  continueButton.disabled = !allowAudioContext;

}

const audioCtx = new AudioContext();
let essentia;

EssentiaWASM().then( (EssentiaWasm)=>{
  essentia = new Essentia(EssentiaWasm);

  // prints version of the essentia wasm backend
  console.log('essentia.js successfully loaded in Version: ', essentia.version)
})

function continueHandler(){
  console.log("Starting")
  if(progessSpinner){
    progessSpinner.classList.remove('hidden')
  }
  audioCtx.resume().then(async (res)=>{
    console.log("Audio Context has been resumed! ", res)
    await analyze()
  })
}

async function analyze() {
  console.log("audioCtx: ", audioCtx)

  const audioURL = fetchUrl //"https://freesound.org/data/previews/328/328857_230356-lq.mp3";

  console.log("audioUrl: ", audioURL)
  if (!audioURL) {
    return
  }

  // decode audio data
  const audioBuffer = await essentia.getAudioBufferFromURL(audioURL, audioCtx);

  const inputSignalVector = await essentia.arrayToVector(audioBuffer.getChannelData(0));

  const computedKeys = await essentia.KeyExtractor(inputSignalVector);

  const computedDuration = await essentia.Duration(inputSignalVector);

  const computedTempo = await essentia.PercivalBpmEstimator(inputSignalVector);

  const computedDanceability = await essentia.Danceability(inputSignalVector);

  const computedEnergy = await essentia.Energy(inputSignalVector);

  displayKey.innerHTML = JSON.stringify(computedKeys.key)
  displayScale.innerHTML = JSON.stringify(computedKeys.scale)
  displayKeyScaleStrength.innerHTML = JSON.stringify(computedKeys.strength)

  displayDuration.innerHTML = JSON.stringify(computedDuration.duration)
  displayBpm.innerHTML = JSON.stringify(computedTempo.bpm)

  displayEnergy.innerHTML = JSON.stringify(computedEnergy.energy)
  displayDanceability.innerHTML = JSON.stringify(computedDanceability.danceability)

  if(progessSpinner){
    progessSpinner.classList.add('hidden')
  }
}