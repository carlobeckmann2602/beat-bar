// Globals

const localCdnUrl = "http://localhost:3001/";

const allFileNames = [
  "aesthetics_sould-prod-music.mp3",
  "bathroom-chill-background-music_chillmore.mp3",
  "chillhop-beat_music-unlimited.mp3",
  "close_sould-prod-music.mp3",
  "coding-night_fassounds.mp3",
  "coffee-chill-out_romanbelov.mp3",
  "dont-stop-me-abstract-future-bass_alexi-action.mp3",
  "embrace_itswatr.mp3",
  "empty-mind_lofi-hour.mp3",
  "goat_prazkhanal.mp3",
  "good-night_fassounds.mp3",
  "in-the-room_lofi-hour.mp3",
  "jazz-cafe_fassounds.mp3",
  "jazzy-hip-hop-boom-bap_music-unlimited.mp3",
  "lofi-beat-chill_watrfallkero.mp3",
  "lofi-chill-medium-version_bo-dleasons.mp3",
  "lofi-girl-dreams_chillmore.mp3",
  "lofi-piano-beat_tuesday-night.mp3",
  "lofi-study_fassounds.mp3",
  "lost-ambient-lofi-60s_lesfm.mp3",
  "rain-and-nostalgia-version-60s_lesfm.mp3",
  "sleepy-cat_lofi-hour.mp3",
  "spirit-blossom_roman-belov.mp3",
  "storm-clouds_purpple-cat.mp3",
  "street-food_fassounds.mp3",
  "sunset-vibes-lo-fichillhop_coma-media.mp3",
  "sweet-chillhop_music-unlimited.mp3",
  "sweet-love_day-fox.mp3",
  "the-weekend_chillmore.mp3",
  "tvari-tokyo-cafe_tvari.mp3",
  "watr-fluid_itswatr.mp3",
];

let fetchUrl = "";
let allowAudioContext = false;
const essentia_properties = {
  key: "x",
  scale: "x",
  key_scale_strength: 1,
  bpm: 100,
  energy: 200,
  danceability: 300,
  moods: "",
  cuepoint_in: 0,
  cuepoint_out: 0,
};

const httpRequest = new XMLHttpRequest();

const threshold = 0.5;

function handler(event) {
  console.log(event.target.response);
}

httpRequest.onreadystatechange = handler;

let postUrl = "";
let apiToken = "YEGmtC4QKGIQQK4qGuRD55q48JIkKazWEnDvQIcDYaA=";

const postRouteInput = document.getElementById("post-route");
if (postRouteInput) {
  postRouteInput.addEventListener("input", (e) => {
    setPostUrl(e);
  });
}

const apiTokenTextarea = document.getElementById("post-header");
if (apiTokenTextarea) {
  apiTokenTextarea.addEventListener("input", (e) => {
    setApiToken(e);
  });
}

const progessSpinner = document.getElementById("progress-spinner");

const continueButton = document.getElementById("continue-button");
if (continueButton) {
  continueButton.disabled = true;
  continueButton.addEventListener("click", () => continueHandler());
}

const displayInputUrl = document.getElementById("output-input-url");
if (!displayInputUrl) {
  console.error(
    "the element with the id 'output-input-url' could not be found in the dom"
  );
}

const displayKey = document.getElementById("output-key");
if (!displayKey) {
  console.error(
    "the element with the id 'output-key' could not be found in the dom"
  );
}

const displayScale = document.getElementById("output-scale");
if (!displayScale) {
  console.error(
    "the element with the id 'output-scale' could not be found in the dom"
  );
}

const displayKeyScaleStrength = document.getElementById(
  "output-key-scale-strength"
);
if (!displayKeyScaleStrength) {
  console.error(
    "the element with the id 'output-key-scale-strength' could not be found in the dom"
  );
}

const displayDuration = document.getElementById("output-duration");
if (!displayDuration) {
  console.error(
    "the element with the id 'output-duration' could not be found in the dom"
  );
}

const displayBpm = document.getElementById("output-bpm");
if (!displayBpm) {
  console.error(
    "the element with the id 'output-bpm' could not be found in the dom"
  );
}

const displayEnergy = document.getElementById("output-energy");
if (!displayEnergy) {
  console.error(
    "the element with the id 'output-energy' could not be found in the dom"
  );
}

const displayDanceability = document.getElementById("output-danceability");
if (!displayDanceability) {
  console.error(
    "the element with the id 'output-danceability' could not be found in the dom"
  );
}

const displayPredictions = document.getElementById("output-predictions");
if (!displayPredictions) {
  console.error(
    "the element with the id 'output-predictions' could not be found in the dom"
  );
}

const displayMoods = document.getElementById("output-moods");
if (!displayMoods) {
  console.error(
    "the element with the id 'output-predictions' could not be found in the dom"
  );
}

const displayCuePointIn = document.getElementById("output-cue-in");
if (!displayCuePointIn) {
  console.error(
    "the element with the id 'output-cue-in' could not be found in the dom"
  );
}

const displayCuePointOut = document.getElementById("output-cue-out");
if (!displayCuePointOut) {
  console.error(
    "the element with the id 'output-cue-out' could not be found in the dom"
  );
}

const setInputButton = document.getElementById("set-input-button");
if (setInputButton) {
  const inputUrl = document.getElementById("input-url");
  if (inputUrl) {
    setInputButton.addEventListener("click", () => {
      fetchUrl = inputUrl.value.toString();
      postRouteInput.value =
        "http://localhost:8000/api/post/properties/?song_id=" +
        fetchUrl.split("/")[3];
      postUrl =
        "http://localhost:8000/api/post/properties/?song_id=" +
        fetchUrl.split("/")[3];
      displayInputUrl.innerHTML = inputUrl.value.toString();
      displayInputUrl.href = inputUrl.value.toString();
    });
  }
}

function handleAllowAudioContext(event) {
  allowAudioContext = event.target.checked;
  continueButton.disabled = !allowAudioContext;
}

const audioCtx = new AudioContext();
let essentia;
let extractor;

EssentiaWASM().then((EssentiaWasm) => {
  essentia = new Essentia(EssentiaWasm);
  extractor = new EssentiaModel.EssentiaTFInputExtractor(
    EssentiaWasm,
    "musicnn",
    false
  );

  // prints version of the essentia wasm backend
  console.log("essentia.js successfully loaded in Version: ", essentia.version);
});

function continueHandler() {
  console.log("Starting");
  if (progessSpinner) {
    progessSpinner.classList.remove("hidden");
  }
  audioCtx.resume().then(async (res) => {
    console.log("Audio Context has been resumed! ", res);
    await analyze();
  });
}

async function analyze() {
  console.log("audioCtx: ", audioCtx);

  const audioURL = fetchUrl; //"https://freesound.org/data/previews/328/328857_230356-lq.mp3";

  console.log("audioUrl: ", audioURL);
  if (!audioURL) {
    return;
  }

  // decode audio data
  const audioBuffer = await essentia.getAudioBufferFromURL(audioURL, audioCtx);

  const inputSignalVector = await essentia.arrayToVector(
    audioBuffer.getChannelData(0)
  );

  const computedKeys = await essentia.KeyExtractor(inputSignalVector);

  const computedDuration = await essentia.Duration(inputSignalVector);

  const computedTempo = await essentia.PercivalBpmEstimator(inputSignalVector);

  const computedDanceability = await essentia.Danceability(inputSignalVector);

  const computedEnergy = await essentia.Energy(inputSignalVector);

  const computedCuePoints = await essentia.vectorToArray(await essentia.BeatTrackerDegara(inputSignalVector).ticks)

  const computedCuePointIn = computedCuePoints[4]

  const computedCuePointOut = computedCuePoints[computedCuePoints.length-16]

  displayKey.innerHTML = JSON.stringify(computedKeys.key);
  essentia_properties.key = computedKeys.key;
  displayScale.innerHTML = JSON.stringify(computedKeys.scale);
  essentia_properties.scale = computedKeys.scale;
  displayKeyScaleStrength.innerHTML = JSON.stringify(computedKeys.strength);
  essentia_properties.key_scale_strength = computedKeys.strength;

  displayDuration.innerHTML = JSON.stringify(computedDuration.duration);
  //duration is stored somewhere else
  displayBpm.innerHTML = JSON.stringify(computedTempo.bpm);
  essentia_properties.bpm = computedTempo.bpm;

  displayEnergy.innerHTML = JSON.stringify(computedEnergy.energy);
  essentia_properties.energy = computedEnergy.energy;
  displayDanceability.innerHTML = JSON.stringify(
    computedDanceability.danceability
  );
  essentia_properties.danceability = computedDanceability.danceability;

  displayCuePointIn.innerHTML = computedCuePointIn ?? 'n.a.';
  essentia_properties.cuepoint_in = computedCuePointIn ?? 0;

  displayCuePointOut.innerHTML = computedCuePointOut ?? 'n.a.';
  essentia_properties.cuepoint_out = computedCuePointOut ?? 0;

  displayPredictions.innerHTML = JSON.stringify(predictions);
  let moods = "";
  for (let mood in predictions) {
    if (predictions[mood] >= threshold) {
      moods += mood + ", ";
    }
  }
  moods = moods.slice(0, -2);
  displayMoods.innerHTML = JSON.stringify(moods);
  essentia_properties.moods = moods;

  if (progessSpinner) {
    progessSpinner.classList.add("hidden");
  }
}

//tensorflow models
const moodNames = ["happy", "sad", "relaxed", "aggressive", "party"];

async function predict_mood(buffer) {
  const audioData = await extractor.downsampleAudioBuffer(buffer, 16000);
  const features = await extractor.computeFrameWise(audioData, 256);

  const promises = moodNames.map(async (modelName) => {
    const modelURL = `./models/mood_${modelName}-musicnn-msd-2/model.json`;
    let musicnn = new EssentiaModel.TensorflowMusiCNN(tf, modelURL);
    await musicnn.initialize();
    return twoValuesAverage(await musicnn.predict(features, true));
  });

  const results = await Promise.all(promises);

  const predictions = {};
  for (let i = 0; i < moodNames.length; i++) {
    predictions[moodNames[i]] = results[i][0];
  }

  return predictions;
}

function twoValuesAverage(arrayOfArrays) {
  let firstValues = [];
  let secondValues = [];

  arrayOfArrays.forEach((v) => {
    firstValues.push(v[0]);
    secondValues.push(v[1]);
  });

  const firstValuesAvg =
    firstValues.reduce((acc, val) => acc + val) / firstValues.length;
  const secondValuesAvg =
    secondValues.reduce((acc, val) => acc + val) / secondValues.length;

  return [firstValuesAvg, secondValuesAvg];
}

function setPostUrl(e) {
  console.log("setting post route: ", e.target.value);
  postUrl = e.target.value;
}

function setApiToken(e) {
  console.log("setting api token: ", e.target.value);
  apiToken = e.target.value;
}

function postResults() {
  console.log("doing request");
  console.log("url", postUrl);
  console.log("x-beatbar-apitoken", apiToken);
  console.log(
    "body",
    JSON.stringify({
      essentia_properties: {
        key: essentia_properties.key,
        scale: essentia_properties.scale,
        key_scale_strength: essentia_properties.key_scale_strength,
        bpm: essentia_properties.bpm,
        energy: essentia_properties.energy,
        danceability: essentia_properties.danceability,
        cuepoint_in: essentia_properties.cuepoint_in,
        cuepoint_out: essentia_properties.cuepoint_out,
        moods: essentia_properties.moods,
      },
    })
  );

  if (fetchUrl.split("/")[3]) {
    httpRequest.open("POST", postUrl, true);
    httpRequest.setRequestHeader("X-Beatbar-ApiToken", apiToken);
    httpRequest.setRequestHeader("Content-Type", "application/json");
    httpRequest.send(
      JSON.stringify({
        essentia_properties: {
          key: essentia_properties.key,
          scale: essentia_properties.scale,
          key_scale_strength: essentia_properties.key_scale_strength,
          bpm: essentia_properties.bpm,
          danceability: essentia_properties.danceability,
          energy: essentia_properties.energy,
          cuepoint_in: essentia_properties.cuepoint_in,
          cuepoint_out: essentia_properties.cuepoint_out,
          moods: essentia_properties.moods,
        },
      })
    );
  }
}
