const continueButton = document.getElementById('continue-button')
if(continueButton){
  continueButton.addEventListener('click', ()=> continueHandler())
}
const algorithmOutput = document.getElementById('algorithm-output')
if(!algorithmOutput){
  console.error("The Algorithm Output View could not be found!")
}

let essentia;
EssentiaWASM().then( (EssentiaWasm)=>{
  essentia = new Essentia(EssentiaWasm);

  // prints version of the essentia wasm backend
  console.log('essentia.js successfully loaded in Version: ', essentia.version)
})

const audioCtx = new AudioContext();

function continueHandler(){
  console.log("Starting")
  audioCtx.resume().then((res)=>{
    console.log("Audio Context has been resumed! ", res)
    analyze()
  })
}

async function analyze() {
  console.log("audioCtx: ", audioCtx)

  const audioURL = "http://localhost:3001/storm-clouds_purpple-cat.mp3" //"https://freesound.org/data/previews/328/328857_230356-lq.mp3";

  console.log("audioUrl: ", audioURL)
  if(!audioURL){
    return
  }

  // decode audio data
  const audioBuffer = await essentia.getAudioBufferFromURL(audioURL, audioCtx);

  /* OR
  * you could also decode audio from any other
  * source and pass to an essentia algorithm. */

  console.log("audioBuffer: ", audioBuffer)
  // convert the JS float32 typed array into std::vector<float>
  const inputSignalVector = await essentia.arrayToVector(audioBuffer.getChannelData(0));

  console.log("inputSignalVector: ", inputSignalVector)


  // Computing ReplayGain from an input audio signal vector
  // The algorithm return float type
  // check https://essentia.upf.edu/reference/std_ReplayGain.html
  let outputRG = essentia.ReplayGain(inputSignalVector, // input
    44100); // sampleRate (parameter optional)

  let _innerHtml = algorithmOutput.innerHTML
  console.log("outputRG.replayGain: ", outputRG.replayGain);
  algorithmOutput.innerHTML = _innerHtml + JSON.stringify(outputRG.replayGain)

  // Running PitchYinProbabilistic algorithm on an input audio signal vector
  // check https://essentia.upf.edu/reference/std_PitchYinProbabilistic.html
  let outputPyYin = essentia.PitchYinProbabilistic(inputSignalVector, // input
    // parameters (optional)
    4096, // frameSize
    256, // hopSize
    0.1, // lowRMSThreshold
    'zero', // outputUnvoiced,
    false, // preciseTime
    44100); //sampleRate

  let pitches = essentia.vectorToArray(outputPyYin.pitch);
  let voicedProbabilities = essentia.vectorToArray(outputPyYin.voicedProbabilities);

  _innerHtml = algorithmOutput.innerHTML
  algorithmOutput.innerHTML = _innerHtml + JSON.stringify(pitches)

  _innerHtml = algorithmOutput.innerHTML
  algorithmOutput.innerHTML = _innerHtml + JSON.stringify(voicedProbabilities)

  outputPyYin.pitch.delete()
  outputPyYin.voicedProbabilities.delete()

  // CAUTION: only use the `shutdown` and `delete` methods below if you've finished your analysis and don't plan on re-using Essentia again in your program lifecycle.

  // call internal essentia::shutdown C++ method
  essentia.shutdown();

  // delete EssentiaJS instance, free JS memory
  essentia.delete();
}
